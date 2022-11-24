import { CompletionContext } from '@codemirror/autocomplete'
import { EditorState, StateEffect, StateEffectType, StateField } from '@codemirror/state'
import {
  EditorView,
  PluginValue,
  Tooltip,
  ViewPlugin,
  ViewUpdate,
  showTooltip,
} from '@codemirror/view'
import { SignatureHelp, SignatureInformation } from 'vscode-languageserver-protocol'

import { LanguageServerPlugin } from '../languageServerPlugin'
import { mdToElements } from '../md'
import { formatContents } from '../utils'

function wrapActiveParameterInLabel(
  signature: SignatureInformation,
  wrap: (parameter: string) => string,
) {
  if (signature.activeParameter === undefined) return signature.label
  if (!signature.parameters) return signature.label

  const activeParameter = signature.parameters[signature.activeParameter]

  if (!activeParameter) return signature.label

  const normalizedLabel =
    typeof activeParameter.label === 'string'
      ? activeParameter.label
      : signature.label.slice(activeParameter.label[0], activeParameter.label[1])
  const wrappedLabel = signature.label.replace(normalizedLabel, wrap(normalizedLabel))

  return wrappedLabel
}

class SignatureState implements PluginValue {
  private lastSignature?: SignatureHelp

  constructor(
    private readonly view: EditorView,
    private readonly getPlugin: () => LanguageServerPlugin | null,
    private readonly setSignatureHelp: StateEffectType<Tooltip | null>,
  ) {}

  async update(update: ViewUpdate) {
    const plugin = this.getPlugin()
    if (!plugin) return

    const isTriggeredByMouseSelection = update.transactions.some(tr =>
      tr.isUserEvent('select.pointer'),
    )
    if (isTriggeredByMouseSelection) return

    if (
      update.docChanged ||
      update.startState.selection.main.head !== update.state.selection.main.head
    ) {
      // TODO: Ideally we should let the language plugin update the textDocument in LS first, without explicitly calling update here.
      await plugin.update(update)

      const pos = update.state.selection.main.head
      const context = new CompletionContext(update.state, pos, false)
      await this.updateSignature(update.state, context, update.docChanged)
    }
  }

  private async updateSignature(
    state: EditorState,
    context: CompletionContext,
    docChanged: boolean,
  ) {
    const plugin = this.getPlugin()
    if (!plugin) return

    const signature = await plugin.requestSignatureHelp(
      context,
      this.lastSignature,
      !!this.lastSignature,
      docChanged,
    )

    this.lastSignature = signature || undefined

    const tooltip = signature ? await this.getTooltip(state, signature) : null
    this.setTooltip(tooltip)
  }

  private async getTooltip(
    state: EditorState,
    signature: SignatureHelp,
  ): Promise<Tooltip | null> {
    const activeSignature =
      signature.activeSignature !== undefined
        ? signature.signatures[signature.activeSignature]
        : undefined
    if (!activeSignature) return null

    // TODO: Handle selecting different signature with up and down arrows
    activeSignature.activeParameter =
      activeSignature.activeParameter !== undefined
        ? activeSignature.activeParameter
        : signature?.activeParameter

    const formattedSignatureContent = formatContents(activeSignature.documentation || '')
    const signatureDocs = await mdToElements(formattedSignatureContent)

    const activeParameter =
      activeSignature.parameters && activeSignature.activeParameter !== undefined
        ? activeSignature.parameters[activeSignature.activeParameter]
        : undefined

    const formattedParameterContent = formatContents(activeParameter?.documentation || '')
    const parameterDocs = await mdToElements(formattedParameterContent)

    if (signatureDocs.length === 0) return null

    const el = document.createElement('div')
    el.id = 'root4'
    el.classList.add('documentation')
    const label = document.createElement('code')
    label.classList.add('signature-label')

    label.innerHTML = wrapActiveParameterInLabel(
      activeSignature,
      parameter => `<code class="selected-param">${parameter}</code>`,
    )

    if (signatureDocs.length !== 0 || parameterDocs.length !== 0) {
      label.innerHTML += '<br/><br/>'
    }

    el.appendChild(label)
    el.append(...signatureDocs)
    if (parameterDocs.length !== 0) {
      el.append(...parameterDocs)
    }

    const tooltip: Tooltip = {
      pos: state.selection.main.head,
      create: () => ({ dom: el }),
      above: true,
    }
    return tooltip
  }

  private setTooltip(tooltip: Tooltip | null) {
    const effect = this.setSignatureHelp.of(tooltip)
    this.view.dispatch({ effects: effect })
  }
}

const setSignatureHelpTooltip = StateEffect.define<Tooltip | null>()
export const closeSignatureHelpTooltip = setSignatureHelpTooltip.of(null)

export function signature(getPlugin: () => LanguageServerPlugin | null) {
  const tooltipState = StateField.define<Tooltip | null>({
    create() {
      return null
    },
    update(value, tr) {
      if (tr.isUserEvent('select.pointer')) return null
      for (const e of tr.effects) {
        if (e.is(setSignatureHelpTooltip)) {
          return e.value
        }
      }
      return value
    },
    provide: field =>
      showTooltip.compute(['selection', field], state => {
        if (!field) return null

        const tooltip = state.field(field)
        if (!tooltip) return null

        // We mutate the position so the tooltip is always positioned correctly
        // Without this the position would be only updated with the whole signature help asynchronously.s
        tooltip.pos = state.selection.main.head
        return { ...tooltip }
      }),
  })

  return [
    ViewPlugin.define(
      view => new SignatureState(view, getPlugin, setSignatureHelpTooltip),
    ),
    tooltipState,
  ]
}
