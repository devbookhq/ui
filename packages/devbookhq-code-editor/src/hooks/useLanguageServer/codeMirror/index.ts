import { Completion, autocompletion } from '@codemirror/autocomplete'
import { Diagnostic } from '@codemirror/lint'
import { Extension, Prec } from '@codemirror/state'
import { ViewPlugin, closeHoverTooltips, hoverTooltip, keymap, Tooltip } from '@codemirror/view'
import { CompletionTriggerKind, Hover } from 'vscode-languageserver-protocol'

import { createIconImages } from '../icons'
import { LanguageServerClient } from '../languageServerClient'
import {
  LanguageServerPlugin,
  client,
  documentURI,
  languageID,
} from '../languageServerPlugin'
import { offsetToPos } from '../utils'
import { closeSignatureHelpTooltip, signature } from './signature'

export function createExtension(options: {
  documentURI: string
  client: LanguageServerClient
  openFile: boolean
  onDiagnosticsChange?: (diagnostics: Diagnostic[]) => void
  onHoverView?: (hover: Hover) => void
}): { extension: Extension, dispose: () => void } {
  let plugin: LanguageServerPlugin | null = null

  const getPlugin = () => plugin

  const { getImage: getIconImage } = createIconImages()

  const { extension: signatureExtension, getSignatureState } = signature(getPlugin)

  const p = ViewPlugin.define(
    view => (plugin = new LanguageServerPlugin(
      view,
      options.openFile,
      getSignatureState,
      options.onDiagnosticsChange,
    )),
  )

  return {
    extension: [
      client.of(options.client),
      documentURI.of(options.documentURI),
      languageID.of(options.client.languageID),
      signatureExtension,
      p,
      Prec.highest(
        keymap.of([
          {
            key: 'Mod-s',
            run: view => {
              plugin?.requestFormatting(view)
              // Pass the event to the next keybinding
              return false
            },
          },
          {
            key: 'Escape',
            run: view => {
              view.dispatch({ effects: [closeHoverTooltips, closeSignatureHelpTooltip] })
              return false
            },
          },
        ]),
      ),
      hoverTooltip(async (view, pos) => {
        const plugin = getPlugin()

        if (!plugin) return null

        const positon = offsetToPos(view.state.doc, pos)

        const requested: { result: Hover, tooltip: Tooltip } | null = await plugin.requestHoverTooltip(view, positon)

        if (requested?.result) {
          options.onHoverView?.(requested.result)
        }

        return requested?.tooltip || null
      }, {
        hoverTime: 35,
      }),
      autocompletion({
        interactionDelay: 20,
        activateOnTyping: true,
        maxRenderedOptions: 40,
        closeOnBlur: false,
        icons: false,
        addToOptions: [
          {
            render(completion: Completion & { iconCache?: Node }) {
              if (!completion.type) return null

              if (!completion.iconCache) {
                completion.iconCache = getIconImage(completion.type)
              }

              return completion.iconCache || null
            },
            // Icons are at position 20 at default
            position: 20,
          },
        ],
        override: [
          async context => {
            if (!plugin) return null

            const { state, pos, explicit } = context
            const line = state.doc.lineAt(pos)
            let trigKind: CompletionTriggerKind = CompletionTriggerKind.Invoked
            let trigChar: string | undefined
            if (
              !explicit &&
              plugin.client.capabilities?.completionProvider?.triggerCharacters?.includes(
                line.text[pos - line.from - 1],
              )
            ) {
              trigKind = CompletionTriggerKind.TriggerCharacter
              trigChar = line.text[pos - line.from - 1]
            }

            return await plugin.requestCompletion(context, offsetToPos(state.doc, pos), {
              triggerKind: trigKind,
              triggerCharacter: trigChar,
            })
          },
        ],
      }),
    ],
    dispose: () => {
      plugin?.destroy()
    }
  }
}
