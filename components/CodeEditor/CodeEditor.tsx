import {
  useRef,
  memo,
  useLayoutEffect,
} from 'react'

import {
  Language,
} from './language'
import createEditorState from './createEditorState'
import { EditorView } from '@codemirror/view'

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
  const editorEl = useRef<HTMLDivElement>(null)

  useLayoutEffect(function initEditor() {
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
    content,
    onContentChange,
    language,
    isReadonly,
  ])

  return (
    <div
      className={`
        flex-1
        flex
        max-h-full
        min-w-0
        overflow-auto
        ${className}
      `}
      ref={editorEl}
      style={{
        ...height && { height },
      }}
    />
  )
}

export default memo(Editor)
