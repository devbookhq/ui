import {
  useEffect,
  useRef,
} from 'react';
import {
  EditorState,
  EditorView,
  basicSetup,
} from '@codemirror/basic-setup';
import {
  keymap,
} from '@codemirror/view'
import {
  defaultKeymap,
  indentWithTab,
} from '@codemirror/commands'
import {
  javascriptLanguage,
} from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'

export interface Props {
  initialCode: string
  onChange: (content: string) => void
  lightTheme?: boolean
}

function Editor({
  initialCode,
  onChange,
  lightTheme,
}: Props) {
  const editorEl = useRef<HTMLDivElement>(null);

  useEffect(function createEditor() {
    if (!editorEl.current) return;

    const changeWatcher = EditorView.updateListener.of(update => {
      if (update.docChanged) {
        onChange(update.state.doc.toString());
      }
    })

    const state = EditorState.create({
      doc: initialCode,
      extensions: [
        basicSetup,
        ...lightTheme ? [] : [oneDark],
        changeWatcher,
        javascriptLanguage,
        keymap.of([
          ...defaultKeymap,
          indentWithTab,
          // Override default browser Ctrl/Cmd+S shortcut when a code cell is focused.
          {
            key: 'Mod-s',
            run: () => true,
          },
        ]),
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
    lightTheme,
  ])

  return (
    <div
      className="flex-1 flex max-h-full min-w-0 devbook"
      ref={editorEl}
    />
  )
}

export default Editor
