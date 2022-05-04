import {
  useRef,
  memo,
  useEffect,
  useState,
} from 'react'
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'

import {
  Language,
} from './language'
import createEditorState from './createEditorState'

export interface Props {
  content?: string
  isReadonly?: boolean
  onContentChange?: (content: string) => void
  language?: Language
  height?: string
  className?: string
}

function Editor({
  content = '',
  onContentChange,
  isReadonly = false,
  language,
  height,
  className,
}: Props) {
  const [editorState, setEditorState] = useState<EditorState>()
  const [editorView, setEditorView] = useState<EditorView>()
  const editorEl = useRef<HTMLDivElement>(null)

  useEffect(function initEditor() {
    if (!editorEl.current) return

    const state = createEditorState({
      content,
      onContentChange,
      isReadonly,
      language,
    })

    const view = new EditorView({ state, parent: editorEl.current });

    return () => {
      view.destroy()
    }
  }, [
    onContentChange,
    language,
    isReadonly,
  ])


  return (
    <div
      className={`
        overflow-auto
        ${className || ''}
      `}
      ref={editorEl}
      style={{
        ...height && { height },
      }}
    />
  )
}

export default memo(Editor)
