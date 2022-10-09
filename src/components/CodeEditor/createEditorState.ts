import { closeBrackets, closeBracketsKeymap } from '@codemirror/closebrackets'
import { defaultKeymap, indentWithTab } from '@codemirror/commands'
import { commentKeymap } from '@codemirror/comment'
import { foldGutter, foldKeymap } from '@codemirror/fold'
import { highlightActiveLineGutter, lineNumbers } from '@codemirror/gutter'
import { classHighlightStyle } from '@codemirror/highlight'
import { history, historyKeymap } from '@codemirror/history'
import { indentOnInput } from '@codemirror/language'
import { bracketMatching } from '@codemirror/matchbrackets'
import { Compartment, EditorState } from '@codemirror/state'
import {
  EditorView,
  drawSelection,
  dropCursor,
  highlightActiveLine,
  highlightSpecialChars,
  keymap,
} from '@codemirror/view'

import type { Language } from '../../hooks/usePublishedCodeSnippet'
import { getLanguageHighlight } from './language'

const disableSpellchecking = {
  'data-gramm': 'false',
  spellcheck: 'false',
}

export interface Options {
  content?: string
  isReadOnly?: boolean
  onContentChange?: (content: string) => void
  language: Language
  filename?: string
}

export function createEditorState({ content = '', language }: Options) {
  const languageHighlight = getLanguageHighlight(language)

  const languageServiceExtensions = new Compartment()
  const contentHandlingExtensions = new Compartment()
  const editabilityExtensions = new Compartment()

  const state = EditorState.create({
    doc: content,
    extensions: [
      EditorView.contentAttributes.of(disableSpellchecking),
      editabilityExtensions.of([]),
      lineNumbers(),
      highlightActiveLineGutter(),
      highlightSpecialChars(),
      history(),
      foldGutter(),
      drawSelection(),
      dropCursor(),
      indentOnInput(),
      bracketMatching(),
      closeBrackets(),
      highlightActiveLine(),
      keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...historyKeymap,
        ...foldKeymap,
        ...commentKeymap,
        indentWithTab,
        // Override default browser Ctrl/Cmd+S shortcut when a code editor is focused.
        {
          key: 'Mod-s',
          run: () => true,
        },
      ]),
      languageServiceExtensions.of([]),
      contentHandlingExtensions.of([]),
      languageHighlight,
      classHighlightStyle,
    ],
  })

  return {
    state,
    languageServiceExtensions,
    contentHandlingExtensions,
    editabilityExtensions,
  }
}
