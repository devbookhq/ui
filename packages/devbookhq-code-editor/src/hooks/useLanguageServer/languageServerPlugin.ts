import {
  Completion,
  CompletionContext,
  CompletionResult,
  pickedCompletion,
} from '@codemirror/autocomplete'
import { Diagnostic as CMDiagnostic, setDiagnostics } from '@codemirror/lint'
import { ChangeSpec, Facet, Transaction } from '@codemirror/state'
import { EditorView, PluginValue, Tooltip, ViewUpdate } from '@codemirror/view'
import * as Diff from 'diff'
import {
  CodeActionTriggerKind,
  CompletionItem,
  Diagnostic,
  CompletionItemKind,
  CompletionTriggerKind,
  DiagnosticSeverity,
  InsertTextFormat,
  Position,
  PublishDiagnosticsParams,
  SignatureHelp,
  SignatureHelpTriggerKind,
  Hover,
} from 'vscode-languageserver-protocol'
import { getLast, notEmpty } from '../../utils'

import { SignatureState } from './codeMirror/signature'
import { LanguageServerClient } from './languageServerClient'
import { mdToElements } from './md'
import {
  applyChanges,
  arePositionsOverlapping,
  formatContents,
  offsetToPos,
  offsetToPosRange,
  posToOffset,
  prefixMatch,
} from './utils'

export const timeout = 10000

export const CompletionItemKindMap = Object.fromEntries(
  Object.entries(CompletionItemKind).map(([key, value]) => [value, key.toLowerCase()]),
) as Record<CompletionItemKind, string>
export const ReversedCompletionItemKindMap = Object.fromEntries(
  Object.entries(CompletionItemKind).map(([key, value]) => [key.toLowerCase(), value]),
) as Record<string, CompletionItemKind>

export const client = Facet.define<LanguageServerClient, LanguageServerClient>({
  combine: getLast,
})
export const documentURI = Facet.define<string, string>({ combine: getLast })
export const languageID = Facet.define<string, string>({ combine: getLast })

// https://microsoft.github.io/language-server-protocol/specifications/specification-current/

export class LanguageServerPlugin implements PluginValue {
  public readonly client: LanguageServerClient
  private readonly openPromise: Promise<void>

  private readonly documentURI: string
  private documentVersion = 0
  private diagnostics?: Diagnostic[]

  constructor(
    private view: EditorView,
    openFile: boolean,
    private readonly getSignatureState: () => SignatureState,
    private readonly onDiagnosticsChange?: (diagnostics: CMDiagnostic[]) => void,
  ) {
    const state = this.view.state

    this.client = state.facet(client)
    this.documentURI = view.state.facet(documentURI)
    this.client.attachPlugin(this)

    if (openFile) {
      this.openPromise = this.client.lsp.textDocumentOpened({
        textDocument: {
          text: state.doc.toString(),
          languageId: state.facet(languageID),
          uri: this.documentURI,
          version: this.documentVersion,
        },
      })
    } else {
      this.openPromise = this.client.lsp.textDocumentChanged({
        textDocument: {
          uri: this.documentURI,
          version: this.nextDocumentVersion,
        },
        contentChanges: [{ text: state.doc.toString() }],
      })
    }
  }

  private get nextDocumentVersion() {
    return ++this.documentVersion
  }

  async update(viewUpdate: ViewUpdate) {
    const { docChanged, state } = viewUpdate

    if (docChanged) {
      await this.openPromise

      // There is some bug when we are incrementally updating language server after formatting the document.
      // TODO: We are temporarily solving this by sending the whole document's content as an update.
      await this.client.lsp.textDocumentChanged({
        textDocument: {
          uri: this.documentURI,
          version: this.nextDocumentVersion,
        },
        contentChanges: [{ text: state.doc.toString() }],
      })
    }

    const signatureState = this.getSignatureState()
    await signatureState.handleUpdate(viewUpdate)
  }

  destroy() {
    // TODO: We ideally want to close the textDocument here,
    // but there is some race condition between this closing and opening of the same file in the next guide's step.
    this.client.detachPlugin(this)
  }

  async requestFormatting(view: EditorView) {
    if (!this.client.capabilities?.documentFormattingProvider) return null

    const state = view.state

    const result = await this.client.lsp.getDocumentFormatting({
      textDocument: { uri: this.documentURI },
      options: {
        insertSpaces: true,
        tabSize: 2,
        trimFinalNewlines: true,
        insertFinalNewline: true,
        trimTrailingWhitespace: true,
      },
    })

    // Convert changes from line/column to offset based representation
    const changes: ChangeSpec[] =
      result?.map(c => ({
        from: posToOffset(state.doc, c.range.start) || 0,
        to: posToOffset(state.doc, c.range.end),
        insert: c.newText,
      })) || []

    // We recalculate the changes to reflect the minimal changes from the old text,
    // because language servers can send the whole text, not just diffs, which breaks selection in the CM editor.

    // Apply the changes and create minimal changes by diffing the old and new text
    const newText = applyChanges(state.doc.toString(), changes)
    const minimalDiff = Diff.diffChars(state.doc.toString(), newText)

    const minimalChanges: ChangeSpec[] = []
    let offset = 0

    // Convert the minimal diff to offset based changes that the CM can apply
    minimalDiff.forEach(d => {
      if (d.removed) {
        minimalChanges.push({
          from: offset,
          to: offset + d.value.length,
        })
        offset += d.value.length
      } else if (d.added) {
        minimalChanges.push({
          from: offset,
          insert: d.value,
        })
      } else {
        offset += d.value.length
      }
    })

    if (!minimalChanges.length) return

    view.dispatch({
      annotations: [Transaction.remote.of(true), Transaction.addToHistory.of(true)],
      changes: minimalChanges,
    })
  }

  async requestHoverTooltip(
    { state: { doc } }: EditorView,
    { line, character }: Position,
  ): Promise<{ tooltip: Tooltip, result: Hover } | null> {
    if (!this.client.capabilities.hoverProvider) return null

    const result = await this.client.lsp.getHoverInfo({
      textDocument: { uri: this.documentURI },
      position: {
        line,
        character,
      },
    })

    if (!result) return null
    const { contents, range } = result
    let pos = posToOffset(doc, {
      line,
      character,
    })

    const formattedContents = formatContents(contents)
    const mdElements = await mdToElements(formattedContents)

    if (mdElements.length === 0) return null

    const el = document.createElement('div')
    el.id = 'root2'
    el.classList.add('documentation')
    el.append(...mdElements)

    let end: number | undefined
    if (range) {
      pos = posToOffset(doc, range.start)
      end = posToOffset(doc, range.end)
    }
    if (pos === null) return null

    return {
      result,
      tooltip: {
        pos,
        end,
        create: () => ({ dom: el }),
        above: true,
      }
    }
  }

  async requestCodeActions(
    view: EditorView,
    range: { from: number, to: number },
  ) {
    if (!this.client.capabilities?.codeActionProvider) return null

    const state = view.state
    const positionRange = offsetToPosRange(state.doc, range)
    const diagnostics = this.diagnostics?.filter(d => arePositionsOverlapping(state.doc, positionRange, d.range)) || []

    const actions = await this.client.lsp.getCodeAction({
      textDocument: { uri: this.documentURI },
      range: positionRange,
      context: {
        triggerKind: CodeActionTriggerKind.Invoked,
        diagnostics,
      },
    })

    if (!actions) return null

    const actionDetails = (
      await Promise.all(
        actions.map(async a => {
          if ('kind' in a) {
            // code action
            const action = await this.client.lsp.resolveCodeAction(a)
            return action
          }
          // command
          return a
        })
      )
    ).filter(notEmpty)

    return actionDetails
  }

  async executeAction(
    command: string,
    args: any[],
  ) {
    if (!this.client.capabilities?.executeCommandProvider) return null

    const result = await this.client.lsp.executeCommand({
      command,
      arguments: args,
    })

    return result
  }

  async requestSignatureHelp(
    context: CompletionContext,
    activeSignatureHelp: SignatureHelp | undefined,
    isRetrigger: boolean,
    docChanged: boolean,
  ): Promise<SignatureHelp | null> {
    if (!this.client.capabilities?.signatureHelpProvider) return null

    const { state, pos, explicit } = context
    if (explicit) return null

    const line = state.doc.lineAt(pos)
    const triggerText = line.text[pos - line.from - 1]

    let triggerKind: SignatureHelpTriggerKind = SignatureHelpTriggerKind.ContentChange
    let triggerCharacter: string | undefined
    if (
      (docChanged &&
        this.client.capabilities.signatureHelpProvider?.triggerCharacters?.includes(
          triggerText,
        )) ||
      (isRetrigger &&
        this.client.capabilities.signatureHelpProvider?.retriggerCharacters?.includes(
          triggerText,
        ))
    ) {
      triggerCharacter = triggerText
      triggerKind = SignatureHelpTriggerKind.TriggerCharacter
    }

    if (!activeSignatureHelp && triggerKind === SignatureHelpTriggerKind.ContentChange)
      return null

    const position = offsetToPos(state.doc, pos)

    return await this.client.lsp.getSignatureHelp({
      position,
      textDocument: { uri: this.documentURI },
      context: {
        triggerKind,
        triggerCharacter,
        isRetrigger,
        activeSignatureHelp,
      },
    })
  }

  async requestCompletion(
    context: CompletionContext,
    { line, character }: Position,
    {
      triggerKind,
      triggerCharacter,
    }: {
      triggerKind: CompletionTriggerKind
      triggerCharacter: string | undefined
    },
  ): Promise<CompletionResult | null> {
    if (!this.client.capabilities.completionProvider) return null

    const result = await this.client.lsp.getCompletion({
      textDocument: { uri: this.documentURI },
      position: {
        line,
        character,
      },
      context: {
        triggerKind,
        triggerCharacter,
      },
    })

    if (!result) return null
    const items = 'items' in result ? result.items : result

    let options = items.map(item => {
      const {
        detail,
        label,
        kind,
        textEdit,
        documentation,
        sortText,
        insertText,
        insertTextFormat,
        additionalTextEdits,
        filterText,
      } = item

      let cachedItemDetails: CompletionItem | null = null

      let apply:
        | string
        | ((view: EditorView, completion: Completion, from: number, to: number) => void)

      if (textEdit) {
        // TODO: There is problem with `apply` being a function - the `prefixMatch` function expects it to be a string
        apply = textEdit.newText
        apply = (view, completion) => {
          const changes: ChangeSpec[] = []

          const state = view.state

          if ('range' in textEdit) {
            if (insertTextFormat === InsertTextFormat.Snippet) {
              // TODO: Handle snippets properly - we should be able to turn off this capability,
              // but some language servers are using it even when it is turned off.
            } else {
              changes.push({
                from: posToOffset(state.doc, textEdit.range.start),
                to: posToOffset(state.doc, textEdit.range.end),
                insert: textEdit.newText,
              })
            }
          } else {
            console.error('Not supporting insert replace language server capability')
          }

          additionalTextEdits?.forEach(e => {
            changes.push({
              from: posToOffset(state.doc, e.range.start),
              to: posToOffset(state.doc, e.range.end),
              insert: e.newText,
            })
          })

          view.dispatch({
            annotations: pickedCompletion.of(completion),
            changes,
          })
        }
      } else if (insertText) {
        if (insertTextFormat === InsertTextFormat.Snippet) {
          // TODO: This is a temporary handling of snippets
          apply = (view, completion, from, to) => {
            const lastSnippetPlaceholder = insertText.indexOf('$0')
            const snippet = insertText.replace('$0', '')
            const cursor =
              lastSnippetPlaceholder === -1 ? undefined : from + lastSnippetPlaceholder

            view.dispatch({
              annotations: pickedCompletion.of(completion),
              changes: [
                {
                  from,
                  to,
                  insert: snippet,
                },
              ],
              selection: cursor
                ? {
                  head: cursor,
                  anchor: cursor,
                }
                : undefined,
            })
          }
        } else {
          apply = insertText
        }
      } else {
        apply = label
      }

      const completion: Completion & {
        filterText: string
        sortText?: string
      } = {
        label,
        detail,
        apply,
        type: kind && CompletionItemKindMap[kind],
        sortText: sortText ?? label,
        filterText: filterText ?? label,
        info: async () => {
          let docs = documentation

          if (!docs && !cachedItemDetails) {
            cachedItemDetails = await this.client.lsp.getCompletionItemDetails(item)
          }

          let detailedLabel: string | undefined = undefined

          if (cachedItemDetails?.labelDetails) {
            detailedLabel =
              cachedItemDetails.label +
              cachedItemDetails.labelDetails.detail +
              cachedItemDetails.labelDetails.description
          }

          docs = cachedItemDetails?.documentation || documentation || detailedLabel

          if (!docs) return null

          const formattedContents = formatContents(docs)
          const mdElements = await mdToElements(formattedContents)

          if (mdElements.length === 0) return null

          const el = document.createElement('div')
          el.id = 'root3'
          el.classList.add('documentation')
          el.append(...mdElements)

          return el
        },
      }

      return completion
    })

    if (options.length === 0) return null

    const [, match] = prefixMatch(options)
    const token = context.matchBefore(match)
    let { pos } = context

    if (token) {
      const word = token.text.toLowerCase()
      pos = token.from

      if (/^\w+$/.test(word)) {
        options = options
          .filter(({ filterText }) => filterText.toLowerCase().startsWith(word))
          .sort(({ label: a }, { label: b }) => {
            switch (true) {
              case a.startsWith(token.text) && !b.startsWith(token.text):
                return -1
              case !a.startsWith(token.text) && b.startsWith(token.text):
                return 1
            }
            return 0
          })
      }
    } else {
      if (!context.explicit && triggerKind !== CompletionTriggerKind.TriggerCharacter) return null
    }

    const longestCompletion = options.reduce(
      (length, current) => Math.max(length, current.label.length),
      0,
    )

    const completion: CompletionResult = {
      from: pos,
      options,
      validFor: text => {
        if (text.length === 0) return false
        if (text.endsWith('.')) return false
        if (text.endsWith(' ')) return false
        if (text.length > longestCompletion) return false

        return true
      },
    }

    return completion
  }

  onDiagnostics(params: PublishDiagnosticsParams) {
    if (params.uri !== this.documentURI) return

    const state = this.view.state
    this.diagnostics = params.diagnostics

    const diagnostics = params.diagnostics
      .map(({ range, message, severity }) => ({
        from: posToOffset(state.doc, range.start),
        to: posToOffset(state.doc, range.end),
        severity:
          (severity &&
            (
              {
                [DiagnosticSeverity.Error]: 'error',
                [DiagnosticSeverity.Warning]: 'warning',
                [DiagnosticSeverity.Information]: 'info',
                [DiagnosticSeverity.Hint]: 'info',
              } as const
            )[severity]) ||
          'info',
        message,
      }))
      .filter(
        ({ from, to }) =>
          from !== null && to !== null && from !== undefined && to !== undefined,
      )
      .sort((a, b) => {
        switch (true) {
          case a.from < b.from:
            return -1
          case a.from > b.from:
            return 1
        }
        return 0
      })

    this.view.dispatch(setDiagnostics(state, diagnostics))
    this.onDiagnosticsChange?.(diagnostics)
  }
}
