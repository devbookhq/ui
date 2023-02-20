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
import { customLineHighlighter } from './customLineHighligher'

const disableSpellchecking = {
  'data-gramm': 'false',
  spellcheck: 'false',
}

function createEditorState(content: string) {
  const languageExtensions = new Compartment()
  const languageServiceExtensions = new Compartment()
  const contentHandlingExtensions = new Compartment()
  const editabilityExtensions = new Compartment()
  const keymapExtensions = new Compartment()
  const themeExtensions = new Compartment()

  const state = EditorState.create({
    doc: content,
    extensions: [
      EditorView.contentAttributes.of(disableSpellchecking),
      editabilityExtensions.of([]),
      lintGutter({
        tooltipFilter: _ => [],
        markerFilter: d => d.filter(v => v.severity === 'error'),
      }),
      lineNumbers(),
      bracketMatching(),
      highlightSpecialChars(),
      customLineHighlighter(),
      history(),
      EditorState.tabSize.of(2),
      // drawSelection(),
      dropCursor(),
      closeBrackets(),
      indentOnInput(),
      keymapExtensions.of([]),
      keymap.of([
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
      themeExtensions.of([]),
      languageServiceExtensions.of([]),
      contentHandlingExtensions.of([]),
      languageExtensions.of([]),
    ],
  })

  return {
    state,
    languageExtensions,
    keymapExtensions,
    themeExtensions,
    languageServiceExtensions,
    contentHandlingExtensions,
    editabilityExtensions,
  }
}

export default createEditorState
