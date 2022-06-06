import { h } from 'preact'
import {
  useRef,
  useEffect,
} from 'preact/hooks'
import { memo } from 'preact/compat'
import { EditorView } from '@codemirror/view'

import {
  Language,
} from './language'
import createEditorState from './createEditorState'

export interface Props {
  content?: string
  isReadOnly?: boolean
  onContentChange?: (content: string) => void
  language?: Language
  height?: string
}

function Editor({
  content = '',
  onContentChange,
  isReadOnly = false,
  language,
  height,
}: Props) {
  const editorEl = useRef<HTMLDivElement>(null)

  useEffect(function initEditor() {
    if (!editorEl.current) return

    const state = createEditorState({
      content,
      onContentChange,
      isReadOnly,
      language,
    })

    const view = new EditorView({ state, parent: editorEl.current })

    return () => {
      view.destroy()
    }
  }, [
    onContentChange,
    language,
    isReadOnly,
  ])

  return (
    <div
      className="
        overflow-auto
        bg-black-800
        dbk-editor
      "
      ref={editorEl}
      style={{
        ...height && { height },
      }}
    />
  )
}

export default memo(Editor)
