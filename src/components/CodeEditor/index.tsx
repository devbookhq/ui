import React, {
  useRef,
  useLayoutEffect,
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from 'react'
import { EditorView } from '@codemirror/view'
import {
  Compartment,
  EditorState,
} from '@codemirror/state'
import type { Language } from '../../hooks/usePublishedCodeSnippet'

import { createEditorState } from './createEditorState'

export interface Props {
  content?: string
  isReadOnly?: boolean
  onContentChange?: (content: string) => void
  language: Language
  height?: string
  className?: string
  autofocus?: boolean
  filename?: string
}

export interface Handler {
  focus: () => void
}

const CodeEditor = forwardRef<Handler, Props>(({
  content,
  isReadOnly = false,
  language,
  height,
  className,
  autofocus,
}, ref) => {
  const editorEl = useRef<HTMLDivElement>(null)
  const [editor, setEditor] = useState<{
    view: EditorView,
    editabilityExtensions: Compartment,
    languageServiceExtensions: Compartment,
    contentHandlingExtensions: Compartment,
  }>()

  useImperativeHandle(ref, () => ({
    focus: () => editor?.view.focus(),
  }), [
    editor,
  ])

  useLayoutEffect(function initEditor() {
    if (!editorEl.current) return

    const {
      languageServiceExtensions,
      contentHandlingExtensions,
      editabilityExtensions,
      state,
    } = createEditorState({
      content,
      language,
    })

    const view = new EditorView({ state, parent: editorEl.current })
    setEditor({
      view,
      languageServiceExtensions,
      contentHandlingExtensions,
      editabilityExtensions,
    })

    if (autofocus) {
      view.focus()
    }

    return () => {
      view.destroy()
      setEditor(undefined)
    }
  }, [
    autofocus,
    language,
    content,
  ])

  useEffect(function configureEditability() {
    if (!editor) return

    editor.view.dispatch({
      effects: editor.editabilityExtensions.reconfigure([
        EditorState.readOnly.of(isReadOnly),
        EditorView.editable.of(!isReadOnly),
      ]),
    })

    return () => {
      editor.view.dispatch({
        effects: editor.editabilityExtensions.reconfigure([]),
      })
    }
  }, [
    editor,
    isReadOnly,
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
})

CodeEditor.displayName = 'CodeEditor'

export default CodeEditor
