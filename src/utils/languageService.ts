import {
  autocompletion,
  startCompletion,
} from '@codemirror/autocomplete'
import { Facet, Prec } from '@codemirror/state'
import type { Text } from '@codemirror/state'
import {
  ViewUpdate,
  PluginValue,
  EditorView,
  ViewPlugin,
  keymap,
} from '@codemirror/view'
import {
  RequestManager,
  Client,
  WebSocketTransport,
} from '@open-rpc/client-js'
import {
  CompletionItemKind,
  CompletionTriggerKind,
} from 'vscode-languageserver-protocol'
import type {Completion,
  CompletionContext,
  CompletionResult,
} from '@codemirror/autocomplete'
import type * as LSP from 'vscode-languageserver-protocol'
import type { Transport } from '@open-rpc/client-js/build/transports/Transport'

const timeout = 10000
const changesDelay = 500

const CompletionItemKindMap = Object.fromEntries(
  Object.entries(CompletionItemKind).map(([key, value]) => [value, key])
) as Record<CompletionItemKind, string>

const useLast = (values: readonly any[]) => values.reduce((_, v) => v, '')

const client = Facet.define<LanguageServerClient, LanguageServerClient>({ combine: useLast })
const documentUri = Facet.define<string, string>({ combine: useLast })
const languageId = Facet.define<string, string>({ combine: useLast })

// https://microsoft.github.io/language-server-protocol/specifications/specification-current/

// Client to server then server to client
interface LSPRequestMap {
  initialize: [LSP.InitializeParams, LSP.InitializeResult]
  'textDocument/hover': [LSP.HoverParams, LSP.Hover]
  'textDocument/completion': [
    LSP.CompletionParams,
    LSP.CompletionItem[] | LSP.CompletionList | null
  ]
}

// Client to server
interface LSPNotifyMap {
  initialized: LSP.InitializedParams
  'textDocument/didChange': LSP.DidChangeTextDocumentParams
  'textDocument/didOpen': LSP.DidOpenTextDocumentParams
}

// Server to client
interface LSPEventMap {
  'textDocument/publishDiagnostics': LSP.PublishDiagnosticsParams
}

type Notification = {
  [key in keyof LSPEventMap]: {
    jsonrpc: '2.0'
    id?: null | undefined
    method: key
    params: LSPEventMap[key]
  }
}[keyof LSPEventMap]

export class LanguageServerClient {
  public ready = false
  public capabilities?: LSP.ServerCapabilities<any>

  private rootUri: string | null
  private workspaceFolders: LSP.WorkspaceFolder[] | null
  private autoClose?: boolean

  private transport: Transport
  private requestManager: RequestManager
  private client: Client

  private plugins: LanguageServicePlugin[]

  constructor(options: LanguageServerClientOptions) {
    this.rootUri = options.rootUri
    this.workspaceFolders = options.workspaceFolders
    this.autoClose = options.autoClose
    this.plugins = []
    this.transport = options.transport

    this.requestManager = new RequestManager([this.transport])
    this.client = new Client(this.requestManager)

    this.client.onNotification((data) => {
      this.processNotification(data as any)
    })

    this.client.onError((data) => {
      console.error('Error in language service', data)
    })

    const webSocketTransport = <WebSocketTransport>this.transport
    if (webSocketTransport && webSocketTransport.connection) {
      // XXX(hjr265): Need a better way to do this. Relevant issue:
      // https://github.com/FurqanSoftware/codemirror-languageserver/issues/9
      webSocketTransport.connection.addEventListener('message', (message: any) => {
        const data = JSON.parse(message.data)
        if (data.method && data.id) {
          webSocketTransport.connection.send(JSON.stringify({
            jsonrpc: '2.0',
            id: data.id,
            result: null
          }))
        }
      })
    }
    this.initialize()
  }

  async initialize() {
    const result = await this.request('initialize', {
      capabilities: {
        textDocument: {
          hover: {
            dynamicRegistration: true,
            contentFormat: ['plaintext', 'markdown'],
          },
          moniker: {},
          synchronization: {
            dynamicRegistration: true,
            willSave: false,
            didSave: false,
            willSaveWaitUntil: false,
          },
          completion: {
            dynamicRegistration: true,
            completionItem: {
              snippetSupport: false,
              commitCharactersSupport: true,
              documentationFormat: ['plaintext', 'markdown'],
              deprecatedSupport: false,
              preselectSupport: false,
            },
            contextSupport: false,
          },
          signatureHelp: {
            dynamicRegistration: true,
            signatureInformation: {
              documentationFormat: ['plaintext', 'markdown'],
            },
          },
          declaration: {
            dynamicRegistration: true,
            linkSupport: true,
          },
          definition: {
            dynamicRegistration: true,
            linkSupport: true,
          },
          typeDefinition: {
            dynamicRegistration: true,
            linkSupport: true,
          },
          implementation: {
            dynamicRegistration: true,
            linkSupport: true,
          },
        },
        workspace: {
          didChangeConfiguration: {
            dynamicRegistration: true,
          },
        },
      },
      initializationOptions: null,
      processId: null,
      rootUri: this.rootUri,
      workspaceFolders: this.workspaceFolders,
    }, timeout * 3)
  
    if (!result?.capabilities) return

    this.capabilities = result.capabilities
    this.notify('initialized', {})
    this.ready = true
  }

  close() {
    this.client.close()
  }

  textDocumentDidOpen(params: LSP.DidOpenTextDocumentParams) {
    return this.notify('textDocument/didOpen', params)
  }

  textDocumentDidChange(params: LSP.DidChangeTextDocumentParams) {
    return this.notify('textDocument/didChange', params)
  }

  async textDocumentHover(params: LSP.HoverParams) {
    return await this.request('textDocument/hover', params, timeout)
  }

  async textDocumentCompletion(params: LSP.CompletionParams) {
    return await this.request('textDocument/completion', params, timeout)
  }

  attachPlugin(plugin: LanguageServicePlugin) {
    this.plugins.push(plugin)
  }

  detachPlugin(plugin: LanguageServicePlugin) {
    const i = this.plugins.indexOf(plugin)
    if (i === -1) return
    this.plugins.splice(i, 1)
    if (this.autoClose) this.close()
  }

  private request<K extends keyof LSPRequestMap>(
    method: K,
    params: LSPRequestMap[K][0],
    timeout: number
  ): Promise<LSPRequestMap[K][1]> {
    return this.client.request({ method, params }, timeout).catch(err => console.log(err))
  }

  private notify<K extends keyof LSPNotifyMap>(
    method: K,
    params: LSPNotifyMap[K]
  ): Promise<LSPNotifyMap[K]> {
    return this.client.notify({ method, params }).catch(err => console.log(err))
  }

  private processNotification(notification: Notification) {
    for (const plugin of this.plugins)
      plugin.processNotification(notification)
  }
}

class LanguageServicePlugin implements PluginValue {
  public client: LanguageServerClient

  private documentUri: string
  private languageId: string
  private documentVersion: number

  private changesTimeout: number

  constructor(private view: EditorView) {
    this.client = this.view.state.facet(client)
    this.documentUri = this.view.state.facet(documentUri)
    this.languageId = this.view.state.facet(languageId)
    this.documentVersion = 0
    this.changesTimeout = 0

    this.client.attachPlugin(this)

    this.initialize({
      documentText: this.view.state.doc.toString(),
    })
  }

  update({ docChanged }: ViewUpdate) {
    if (!docChanged) return
    if (this.changesTimeout) clearTimeout(this.changesTimeout)
    this.changesTimeout = self.setTimeout(() => {
      this.sendChange({
        documentText: this.view.state.doc.toString(),
      })
    }, changesDelay)
  }

  destroy() {
    this.client.detachPlugin(this)
  }

  async initialize({ documentText }: { documentText: string }) {
    this.client.textDocumentDidOpen({
      textDocument: {
        uri: this.documentUri,
        languageId: this.languageId,
        text: documentText,
        version: this.documentVersion,
      }
    })
  }

  async sendChange({ documentText }: { documentText: string }) {
    if (!this.client.ready) return
    try {
      await this.client.textDocumentDidChange({
        textDocument: {
          uri: this.documentUri,
          version: this.documentVersion++,
        },
        contentChanges: [{ text: documentText }],
      })
    } catch (e) {
      console.error(e)
    }
  }

  requestDiagnostics(view: EditorView) {
    this.sendChange({ documentText: view.state.doc.toString() })
  }

  // async requestHoverTooltip(
  //   view: EditorView,
  //   { line, character }: { line: number, character: number }
  // ): Promise<Tooltip | null> {
  //   if (!this.client.ready || !this.client.capabilities!.hoverProvider) return null

  //   this.sendChange({ documentText: view.state.doc.toString() })
  //   const result = await this.client.textDocumentHover({
  //     textDocument: { uri: this.documentUri },
  //     position: { line, character },
  //   })
  //   if (!result) return null
  //   const { contents, range } = result
  //   let pos = posToOffset(view.state.doc, { line, character })!
  //   let end: number | undefined
  //   if (range) {
  //     pos = posToOffset(view.state.doc, range.start)!
  //     end = posToOffset(view.state.doc, range.end)!
  //   }
  //   if (pos === null) return null

  //   const dom = document.createElement('div')
  //   dom.id = 'root2'
  //   dom.classList.add('documentation')
  //   dom.textContent = formatContents(contents)
  //   return { pos, end, create: (view) => ({ dom }), above: true }
  // }

  async requestCompletion(
    context: CompletionContext,
    { line, character }: { line: number, character: number },
    {
      triggerKind,
      triggerCharacter,
    }: {
      triggerKind: CompletionTriggerKind
      triggerCharacter: string | undefined
    }
  ): Promise<CompletionResult | null> {
    if (!this.client.ready || !this.client.capabilities!.completionProvider) return null
    this.sendChange({
      documentText: context.state.doc.toString(),
    })

    const result = await this.client.textDocumentCompletion({
      textDocument: { uri: this.documentUri },
      position: { line, character },
      context: {
        triggerKind,
        triggerCharacter,
      }
    })

    if (!result) return null
    const items = 'items' in result ? result.items : result

    let options = items.map(
      ({
        detail,
        label,
        kind,
        textEdit,
        documentation,
        sortText,
        insertText,
        filterText,
      }) => {
        const completion: Completion & {
          filterText: string
          sortText?: string
          apply: string
        } = {
          label,
          detail,
          apply: textEdit?.newText ?? insertText ?? label,
          type: kind && CompletionItemKindMap[kind].toLowerCase(),
          sortText: sortText ?? label,
          filterText: filterText ?? label,
        }
        if (documentation) {
          completion.info = formatContents(documentation)
        }
        return completion
      }
    )

    const [span, match] = prefixMatch(options)
    const token = context.matchBefore(match)
    let { pos } = context

    if (token) {
      pos = token.from
      const word = token.text.toLowerCase()
      if (/^\w+$/.test(word)) {
        options = options
          .filter(({ filterText }) =>
            filterText.toLowerCase().startsWith(word)
          )
          .sort(({ apply: a }, { apply: b }) => {
            switch (true) {
              case a.startsWith(token.text) &&
                !b.startsWith(token.text):
                return -1
              case !a.startsWith(token.text) &&
                b.startsWith(token.text):
                return 1
            }
            return 0
          })
      }
    }
    return {
      from: pos,
      options,
      span,
    }
  }

  processNotification(notification: Notification) {
    // try {
    //   switch (notification.method) {
    //     case 'textDocument/publishDiagnostics':
    //       this.processDiagnostics(notification.params)
    //   }
    // } catch (error) {
    //   console.error(error)
    // }
  }

  // processDiagnostics(params: PublishDiagnosticsParams) {
  //   if (params.uri !== this.documentUri) return

  //   const diagnostics = params.diagnostics
  //     .map(({ range, message, severity }) => ({
  //       from: posToOffset(this.view.state.doc, range.start)!,
  //       to: posToOffset(this.view.state.doc, range.end)!,
  //       severity: ({
  //         [DiagnosticSeverity.Error]: 'error',
  //         [DiagnosticSeverity.Warning]: 'warning',
  //         [DiagnosticSeverity.Information]: 'info',
  //         [DiagnosticSeverity.Hint]: 'info',
  //       } as const)[severity!],
  //       message,
  //     }))
  //     .filter(({ from, to }) => from !== null && to !== null && from !== undefined && to !== undefined)
  //     .sort((a, b) => {
  //       switch (true) {
  //         case a.from < b.from:
  //           return -1
  //         case a.from > b.from:
  //           return 1
  //       }
  //       return 0
  //     })

  //   this.view.dispatch(setDiagnostics(this.view.state, diagnostics))
  // }
}

interface LanguageServerBaseOptions {
  rootUri: string | null
  workspaceFolders: LSP.WorkspaceFolder[] | null
  documentUri: string
  languageId: string
}

interface LanguageServerClientOptions extends LanguageServerBaseOptions {
  transport: Transport,
  autoClose?: boolean
}

interface LanguageServerOptions extends LanguageServerClientOptions {
  client?: LanguageServerClient
}

export function languageService(options: LanguageServerOptions) {
  let plugin: LanguageServicePlugin | null = null

  return [
    // eslint-disable-next-line max-len
    client.of(options.client || new LanguageServerClient({ ...options, autoClose: true })),
    documentUri.of(options.documentUri),
    languageId.of(options.languageId),
    ViewPlugin.define((view) => (plugin = new LanguageServicePlugin(view))),
    //hoverTooltip(
    //  (view, pos) =>
    //    plugin?.requestHoverTooltip(
    //      view,
    //      offsetToPos(view.state.doc, pos)
    //    ) ?? null
    //),
    Prec.highest(keymap.of([
      {
        key: 'Mod-k',
        run: startCompletion,
      },
    ])),
    autocompletion({
      activateOnTyping: true,
      maxRenderedOptions: 20,
      override: [
        async (context) => {
          if (plugin == null) return null

          const { state, pos, explicit } = context
          const line = state.doc.lineAt(pos)
          let trigKind: CompletionTriggerKind =
            CompletionTriggerKind.Invoked
          let trigChar: string | undefined
          if (
            !explicit &&
            plugin.client.capabilities?.completionProvider?.triggerCharacters?.includes(
              line.text[pos - line.from - 1]
            )
          ) {
            trigKind = CompletionTriggerKind.TriggerCharacter
            trigChar = line.text[pos - line.from - 1]
          }

          return await plugin.requestCompletion(
            context,
            offsetToPos(state.doc, pos),
            {
              triggerKind: trigKind,
              triggerCharacter: trigChar,
            }
          )
        },
      ],
    }),
  ]
}

function posToOffset(doc: Text, pos: { line: number, character: number }) {
  if (pos.line >= doc.lines) return
  const offset = doc.line(pos.line + 1).from + pos.character
  if (offset > doc.length) return
  return offset
}

function offsetToPos(doc: Text, offset: number) {
  const line = doc.lineAt(offset)
  return {
    line: line.number - 1,
    character: offset - line.from,
  }
}

function formatContents(
  contents: LSP.MarkupContent | LSP.MarkedString | LSP.MarkedString[]
): string {
  if (Array.isArray(contents)) {
    return contents.map((c) => formatContents(c) + '\n\n').join('')
  } else if (typeof contents === 'string') {
    return contents
  } else {
    return contents.value
  }
}

function toSet(chars: Set<string>) {
  let preamble = ''
  let flat = Array.from(chars).join('')
  const words = /\w/.test(flat)
  if (words) {
    preamble += '\\w'
    flat = flat.replace(/\w/g, '')
  }
  return `[${preamble}${flat.replace(/[^\w\s]/g, '\\$&')}]`
}

function prefixMatch(options: Completion[]) {
  const first = new Set<string>()
  const rest = new Set<string>()

  for (const { apply } of options) {
    const [initial, ...restStr] = apply as string
    first.add(initial)
    for (const char of restStr) {
      rest.add(char)
    }
  }

  const source = toSet(first) + toSet(rest) + '*$'
  return [new RegExp('^' + source), new RegExp(source)]
}
