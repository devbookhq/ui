import {
  useRef,
  memo,
  useLayoutEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from 'react'
import { EditorView } from '@codemirror/view'

import {
  Language,
} from 'types'
import createEditorState from './createEditorState'

export interface Props {
  content?: string
  isReadOnly?: boolean
  onContentChange?: (content: string) => void
  language: Language
  height?: string
  className?: string
  autofocus?: boolean
}

export interface Handler {
  focus: () => void
}

const CodeEditor = forwardRef<Handler, Props>(({
  content = '',
  onContentChange,
  isReadOnly = false,
  language,
  height,
  className,
  autofocus,
}, ref) => {
  const editorEl = useRef<HTMLDivElement>(null)
  const [view, setView] = useState<EditorView>()

  useImperativeHandle(ref, () => ({
    focus: () => view?.focus(),
  }), [
    view,
  ])

  useLayoutEffect(function initEditor() {
    if (!editorEl.current) return

    const state = createEditorState({
      content,
      onContentChange,
      isReadOnly,
      language,
    })

    const newView = new EditorView({ state, parent: editorEl.current })
    setView(newView)

    if (autofocus) {
      newView.focus()
    }

    return () => {
      newView.destroy()
      setView(undefined)
    }
  }, [
    autofocus,
    onContentChange,
    language,
    isReadOnly,
  ])

  return (
    <div
      className={`
        overflow-auto
        bg-black-800
        ${className || ''}
      `}
      ref={editorEl}
      style={{
        ...height && { height },
      }}
    />
  )
})

CodeEditor.displayName = 'CodeEditor'

export default memo(CodeEditor)
