import { classHighlightStyle } from '@codemirror/highlight'
import {
  EditorView,
  keymap,
  highlightSpecialChars,
  drawSelection,
  highlightActiveLine,
  dropCursor,
} from '@codemirror/view'
import {
  EditorState,
} from '@codemirror/state'
import {
  history,
  historyKeymap,
} from '@codemirror/history'
import {
  foldGutter,
  foldKeymap,
} from '@codemirror/fold'
import { indentOnInput } from '@codemirror/language'
import {
  lineNumbers,
  highlightActiveLineGutter,
} from '@codemirror/gutter'
import {
  defaultKeymap,
  indentWithTab,
} from '@codemirror/commands'
import { bracketMatching } from '@codemirror/matchbrackets'
import {
  closeBrackets,
  closeBracketsKeymap,
} from '@codemirror/closebrackets'
import { commentKeymap } from '@codemirror/comment'

import {
  getLanguageExtension,
} from './language'

import type { Language } from 'types'

const disableSpellchecking = {
  'data-gramm': 'false',
  'spellcheck': 'false',
}

export interface Options {
  content?: string
  isReadOnly?: boolean
  onContentChange?: (content: string) => void
  language: Language
}

function createEditorState({
  content = '',
  onContentChange,
  isReadOnly = false,
  language,
}: Options) {
  const changeWatcher = EditorView.updateListener.of(update => {
    if (update.docChanged) {
      onContentChange?.(update.state.doc.toString())
    }
  })

  const languageExtension = getLanguageExtension(language)

  const state = EditorState.create({
    doc: content,
    extensions: [
      EditorView.contentAttributes.of(disableSpellchecking),
      EditorState.readOnly.of(isReadOnly),
      EditorView.editable.of(!isReadOnly),
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
        // Override default browser Ctrl/Cmd+S shortcut when a code cell is focused.
        {
          key: 'Mod-s',
          run: () => true,
        },
      ]),
      changeWatcher,
      languageExtension,
      classHighlightStyle,
    ],
  })
  return state
}

export default createEditorState
