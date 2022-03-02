import {
  useRef,
  memo,
  useEffect,
} from 'react'

import {
  Language,
} from './language'
import Header from './Header'
import Separator from '../Separator'
import createEditorState from './createEditorState'
import { EditorView } from '@codemirror/view'

export interface Props {
  initialContent?: string
  isReadonly?: boolean
  onContentChange?: (content: string) => void
  lightTheme?: boolean
  filepath?: string
  language?: Language
  height?: string
}

function Terminal({
  initialContent = '',
  onContentChange,
  filepath,
  isReadonly = false,
  language,
  lightTheme,
  height,
}: Props) {
  const editorEl = useRef<HTMLDivElement>(null)

  useEffect(function initEditor() {
    if (!editorEl.current) return

    const state = createEditorState({
      initialContent,
      onContentChange,
      isReadonly,
      language,
    })

    const view = new EditorView({ state, parent: editorEl.current });
    return () => {
      view.destroy()
    }
  }, [
    initialContent,
    onContentChange,
    parent,
    language,
    isReadonly,
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
        style={{
          ...height && { height },
        }}
      />
    </div>
  )
}

export default memo(Terminal)
