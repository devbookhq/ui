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
  initialContent?: string
  isReadonly?: boolean
  onContentChange?: (content: string) => void
  lightTheme?: boolean
  language?: Language
  height?: string
}

function Editor({
  initialContent = '',
  onContentChange,
  isReadonly = false,
  language,
  lightTheme,
  height,
}: Props) {
  const editorEl = useRef<HTMLDivElement>(null)

  useLayoutEffect(function initEditor() {
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
    language,
    isReadonly,
  ])

  return (
    <div className={`rounded-lg devbook dark`}>
      <div
        className={`flex-1 flex max-h-full min-w-0 overflow-auto devbook rounded-lg`}
        ref={editorEl}
        style={{
          ...height && { height },
        }}
      />
    </div>
  )
}

export default memo(Editor)
