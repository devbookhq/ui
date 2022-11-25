import { Compartment, EditorState } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

import { LSClients, LanguageSetup, getLanguageSetup } from '../../hooks/useLanguageServer'
import { createExtension } from '../../hooks/useLanguageServer/codeMirror'
import { getFileURI } from '../../hooks/useLanguageServer/utils'
import createEditorState from './createEditorState'

export interface Props {
  content?: string
  isReadOnly?: boolean
  onContentChange?: (content: string) => void
  supportedLanguages: LanguageSetup[]
  height?: string
  className?: string
  autofocus?: boolean
  /**
   *
   * **Absolute** path to the file in the filesystem
   *
   */
  filename: string
  /**
   *
   * The result of the `useLanguageServer` hook should be passed here.
   *
   */
  languageClients?: LSClients
  /**
   * Indicates if the file should be opened in the language server.
   * If `false` the file must have been opened before.
   */
  openFileInLanguageServer?: boolean
}

export interface Handler {
  focus: () => void
}

const CodeEditor = forwardRef<Handler, Props>(
  (
    {
      content = '',
      onContentChange,
      isReadOnly = false,
      supportedLanguages,
      height,
      className = '',
      autofocus,
      filename,
      languageClients,
      openFileInLanguageServer = true,
    },
    ref,
  ) => {
    const editorEl = useRef<HTMLDivElement>(null)
    const [editor, setEditor] = useState<{
      view: EditorView
      editabilityExtensions: Compartment
      languageServiceExtensions: Compartment
      languageExtensions: Compartment
      contentHandlingExtensions: Compartment
    }>()

    const languageSetup = getLanguageSetup(filename, supportedLanguages)
    const languageClient = languageSetup && languageClients?.[languageSetup?.languageID]

    console.log({ languageSetup })

    useImperativeHandle(ref, () => ({ focus: () => editor?.view.focus() }), [editor])

    useLayoutEffect(
      function initEditor() {
        if (!editorEl.current) return

        const {
          languageServiceExtensions,
          contentHandlingExtensions,
          languageExtensions,
          editabilityExtensions,
          state,
        } = createEditorState(content)

        const view = new EditorView({
          state,
          parent: editorEl.current,
        })

        setEditor({
          view,
          languageServiceExtensions,
          contentHandlingExtensions,
          languageExtensions,
          editabilityExtensions,
        })

        if (autofocus) {
          view.focus()
        }

        return () => {
          view.destroy()
          setEditor(undefined)
        }
      },
      [autofocus, content],
    )

    useEffect(
      function configureLanguageExtensions() {
        if (!editor) return
        if (!languageSetup?.languageExtensions) return

        console.log('setting language extension')

        editor.view.dispatch({
          effects: editor.languageExtensions.reconfigure(
            languageSetup.languageExtensions,
          ),
        })
        return () => {
          editor.view.dispatch({
            effects: editor.languageExtensions.reconfigure([]),
          })
        }
      },
      [editor, languageSetup],
    )

    useEffect(
      function configureEditability() {
        if (!editor) return

        const extension = [
          EditorState.readOnly.of(isReadOnly),
          EditorView.editable.of(!isReadOnly),
        ]

        editor.view.dispatch({
          effects: editor.editabilityExtensions.reconfigure(extension),
        })
        return () => {
          editor.view.dispatch({ effects: editor.editabilityExtensions.reconfigure([]) })
        }
      },
      [editor, isReadOnly],
    )

    useEffect(
      function configureContentChangeHandling() {
        if (!editor) return
        if (!onContentChange) return

        const extension = EditorView.updateListener.of(update => {
          if (update.docChanged) onContentChange?.(update.state.doc.toString())
        })

        editor.view.dispatch({
          effects: editor.contentHandlingExtensions.reconfigure(extension),
        })
        return () => {
          editor.view.dispatch({
            effects: editor.contentHandlingExtensions.reconfigure([]),
          })
        }
      },
      [editor, onContentChange],
    )

    useEffect(
      function configureLanguageService() {
        if (!editor) return
        if (!filename) return
        if (!languageClient) return

        const extension = createExtension({
          client: languageClient,
          documentURI: getFileURI(filename),
          openFile: openFileInLanguageServer,
        })

        editor.view.dispatch({
          effects: editor.languageServiceExtensions.reconfigure(extension),
        })
        return () => {
          editor.view.dispatch({
            effects: editor.languageServiceExtensions.reconfigure([]),
          })
        }
      },
      [editor, languageClient, filename, openFileInLanguageServer],
    )

    return (
      <div
        className={`overflow-auto ${className}`}
        ref={editorEl}
        style={{ ...(height && { height }) }}
      />
    )
  },
)

CodeEditor.displayName = 'CodeEditor'

export default CodeEditor
