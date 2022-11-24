import { Completion, autocompletion } from '@codemirror/autocomplete'
import { Extension, Prec } from '@codemirror/state'
import { ViewPlugin, closeHoverTooltips, hoverTooltip, keymap } from '@codemirror/view'
import { CompletionTriggerKind } from 'vscode-languageserver-protocol'

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
}): Extension {
  let plugin: LanguageServerPlugin | null = null

  const getPlugin = () => plugin
  
  const { getImage: getIconImage } = createIconImages()

  return [
    client.of(options.client),
    documentURI.of(options.documentURI),
    languageID.of(options.client.languageID),
    ViewPlugin.define(
      view => (plugin = new LanguageServerPlugin(view, options.openFile)),
    ),
    Prec.highest(
      keymap.of([
        {
          key: 'Mod-s',
          run: c => {
            plugin?.requestFormatting(c)
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
    signature(getPlugin),
    hoverTooltip(async (view, pos) => {
      if (!plugin) return null

      const positon = offsetToPos(view.state.doc, pos)

      return await plugin.requestHoverTooltip(view, positon)
    }),
    autocompletion({
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
  ]
}
