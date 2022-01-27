import {
  useEffect,
  useRef,
} from 'react';
import { classHighlightStyle } from '@codemirror/highlight'
import {
  EditorView,
  keymap,
  highlightSpecialChars,
  drawSelection,
  highlightActiveLine,
  dropCursor,
} from '@codemirror/view'
import { EditorState } from '@codemirror/state'
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
  Language,
} from './language'
import Header from './Header'
import Separator from '../Separator'

export interface Props {
  initialCode?: string
  onChange?: (content: string) => void
  lightTheme?: boolean
  filepath?: string
  language?: Language
}

function Editor({
  initialCode = '',
  onChange,
  filepath,
  language,
  lightTheme,
}: Props) {
  const editorEl = useRef<HTMLDivElement>(null);

  useEffect(function createEditor() {
    if (!editorEl.current) return;

    const changeWatcher = EditorView.updateListener.of(update => {
      if (update.docChanged) {
        onChange?.(update.state.doc.toString());
      }
    })

    const languageExtension = getLanguageExtension(language)

    const state = EditorState.create({
      doc: initialCode,
      extensions: [
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
    });

    const view = new EditorView({ state, parent: editorEl.current });
    return () => {
      view.destroy()
    }
  }, [
    initialCode,
    onChange,
    editorEl,
    language,
  ])

  return (
    <div className={`rounded ${lightTheme ? '' : 'dark'}`}>
      {filepath &&
        <>
          <Header
            filepath={filepath}
          />
          <Separator
            variant={Separator.variant.CodeEditor}
            dir={Separator.dir.Horizontal}
          />
        </>
      }
      <div
        className={`flex-1 flex max-h-full min-w-0 overflow-auto devbook ${filepath ? 'rounded-b' : 'rounded'}`}
        ref={editorEl}
      />
    </div>
  )
}

export default Editor
