import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete'
import {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab,
} from '@codemirror/commands'
import {
  bracketMatching,
  foldKeymap,
  indentOnInput,
  syntaxHighlighting,
} from '@codemirror/language'
import { lintGutter } from '@codemirror/lint'
import { Compartment, EditorState } from '@codemirror/state'
import {
  EditorView,
  dropCursor,
  highlightSpecialChars,
  keymap,
  lineNumbers,
} from '@codemirror/view'
import { classHighlighter } from '@lezer/highlight'

import { activeLineHighlighter } from './activeLineHighlighter'

const disableSpellchecking = {
  'data-gramm': 'false',
  spellcheck: 'false',
}

function createEditorState(content: string, isReadOnly?: boolean, onRun?: () => void) {
  const languageExtensions = new Compartment()
  const languageServiceExtensions = new Compartment()
  const contentHandlingExtensions = new Compartment()
  const editabilityExtensions = new Compartment()
  const state = EditorState.create({
    doc: content,
    extensions: [
      EditorView.contentAttributes.of(disableSpellchecking),
      editabilityExtensions.of([]),
      lintGutter({
        tooltipFilter: d => [],
        markerFilter: d => d.filter(v => v.severity === 'error'),
      }),
      lineNumbers(),
      bracketMatching(),
      ...isReadOnly ? [] : [activeLineHighlighter()],
      highlightSpecialChars(),
      history(),
      EditorState.tabSize.of(2),
      // drawSelection(),
      dropCursor(),
      closeBrackets(),
      indentOnInput(),
      keymap.of([
        {
          key: 'Mod-Enter',
          run: () => {
            onRun?.()
            return !!onRun
          },
        },
        ...defaultKeymap,
        ...closeBracketsKeymap,
        ...historyKeymap,
        ...foldKeymap,
        indentWithTab,
        {
          // Override default browser Ctrl/Cmd+S shortcut when a code editor is focused.
          key: 'Mod-s',
          run: () => true,
        },
      ]),
      languageServiceExtensions.of([]),
      contentHandlingExtensions.of([]),
      languageExtensions.of([]),
      syntaxHighlighting(classHighlighter),
    ],
  })

  return {
    state,
    languageExtensions,
    languageServiceExtensions,
    contentHandlingExtensions,
    editabilityExtensions,
  }
}

export default createEditorState
