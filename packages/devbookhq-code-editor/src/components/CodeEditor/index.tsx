import { syntaxHighlighting } from '@codemirror/language'
import { Diagnostic as CMDiagnostic, forEachDiagnostic } from '@codemirror/lint'
import { Compartment, EditorState, Prec, Extension } from '@codemirror/state'
import { EditorView, keymap } from '@codemirror/view'
import { classHighlighter } from '@lezer/highlight'
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { Hover } from 'vscode-languageserver-protocol'

import { createExtension } from '../../hooks/useLanguageServer/codeMirror'
import { LanguageSetup, getLanguageSetup } from '../../hooks/useLanguageServer/setup'
import { LSClients } from '../../hooks/useLanguageServer/useLanguageServerClients'
import { getFileURI, offsetToPos } from '../../hooks/useLanguageServer/utils'
import { findSequences } from '../../utils/findSequences'
import { activeLineHighlighter } from './activeLineHighlighter'
import createEditorState from './createEditorState'
import { addGutterHighlight } from './customLineGutterHighlighter'
import { addLineHighlight } from './customLineHighligher'

export interface Props {
  content?: string
  theme?: Extension
  isReadOnly?: boolean
  onContentChange?: (content: string) => void
  handleRun?: () => void
  onDiagnosticsChange?: (diagnostics: ExtendedCMDiagnostic[]) => void
  onHoverView?: (hover: Hover) => void
  supportedLanguages: LanguageSetup[]
  height?: string
  className?: string
  autofocus?: boolean
  /**
   * **Absolute** path to the file in the filesystem
   */
  filename: string
  /**
   * The result of the `useLanguageServer` hook should be passed here.
   */
  languageClients?: LSClients
  /**
   * Indicates if the file should be opened in the language server.
   * If `false` the file must have been opened before.
   */
  openFileInLanguageServer?: boolean
  onCopy?: (selection: string, startLine: number) => void
  /**
   * Add class to these lines so they can be styled
   */
  highlightedLines?: number[]
  /**
   * Add class to these lines so they can be styled like `highlightedLines`. 
   * If a lines is both indicated and highlighted the highlight class takes precedence.
   */
  indicatedLines?: number[]
  onGutterHover?: (line: number | undefined) => void
  onGutterClick?: (line: number | undefined) => void
  lintGutter?: boolean
}

export interface ExtendedCMDiagnostic extends CMDiagnostic {
  filename: string
}

export interface Handler {
  focus: () => void
  getSelection: () => string | undefined
  getDiagnostics: () => ExtendedCMDiagnostic[] | undefined
}

const CodeEditor = forwardRef<Handler, Props>(
  (
    {
      content = '',
      lintGutter = true,
      onContentChange,
      isReadOnly = false,
      supportedLanguages,
      height,
      onCopy,
      className = '',
      handleRun,
      highlightedLines,
      onGutterHover,
      onHoverView,
      autofocus,
      onGutterClick,
      onDiagnosticsChange,
      indicatedLines,
      filename,
      theme = syntaxHighlighting(classHighlighter),
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
      keymapExtensions: Compartment
      themeExtensions: Compartment
      contentHandlingExtensions: Compartment
    }>()

    const languageSetup = getLanguageSetup(filename, supportedLanguages)
    const languageClient = languageSetup && languageClients?.[languageSetup?.languageID]

    useImperativeHandle(ref, () => ({
      focus: () => editor?.view.focus(),
      getDiagnostics: () => {
        if (!editor) return

        const diagnostics: ExtendedCMDiagnostic[] = []

        forEachDiagnostic(editor.view.state, (d, from, to) => diagnostics.push({
          ...d,
          filename,
        }))

        return diagnostics
      },
      getSelection: () => {
        const state = editor?.view.state
        if (!state) return
        if (state.selection.main.empty) return
        return state.sliceDoc(editor.view.state.selection.main.from, editor.view.state.selection.main.to)
      },
    }), [editor, filename])

    useEffect(
      function initEditor() {
        if (!editorEl.current) return

        const {
          languageServiceExtensions,
          contentHandlingExtensions,
          languageExtensions,
          themeExtensions,
          editabilityExtensions,
          keymapExtensions,
          state,
        } = createEditorState(content, { lintGutter })

        const view = new EditorView({
          state,
          parent: editorEl.current,
        })

        setEditor({
          view,
          themeExtensions,
          keymapExtensions,
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
      [
        lintGutter,
        autofocus,
        content,
      ],
    )

    useEffect(
      function configureKeymapExtensions() {
        if (!editor) return
        if (!handleRun && !onCopy) return

        editor.view.dispatch({
          effects: editor.keymapExtensions.reconfigure(
            Prec.highest(keymap.of([
              handleRun ? {
                key: 'Mod-Enter',
                run: () => {
                  handleRun()
                  return !!handleRun
                },
              } : {},
              onCopy ? {
                key: 'Mod-c',
                run: (view) => {
                  const state = view.state
                  if (!state) return false
                  if (state.selection.main.empty) return false
                  const selection = state.sliceDoc(editor.view.state.selection.main.from, editor.view.state.selection.main.to)
                  if (selection.length > 0) {
                    const startLine = offsetToPos(state.doc, editor.view.state.selection.main.from).line
                    onCopy(selection, startLine)
                  }
                  return false
                },
              } : {},
            ]))
          ),
        })
        return () => {
          editor.view.dispatch({
            effects: editor.keymapExtensions.reconfigure([]),
          })
        }
      },
      [editor, handleRun, onCopy],
    )

    useEffect(
      function configureHighlightLines() {
        if (!editor) return
        if (!highlightedLines && !indicatedLines) return

        const state = editor.view.state
        const dimLines: number[] = []

        if (highlightedLines && highlightedLines?.length > 0) {
          for (let i = 1; i <= state.doc.lines; i++) {
            if (!highlightedLines.includes(i)) {
              dimLines.push(i)
            }
          }
        }

        const highlightSequences =
          findSequences((highlightedLines || []).slice().sort((a, b) => a - b))
        // Filter out the highlighted lines, sort the lines and then aggregate them to sequences.
        const indicateSequences =
          findSequences((indicatedLines || []).filter(l => !highlightedLines?.includes(l)).slice().sort((a, b) => a - b))

        editor.view.dispatch({
          effects: [
            addGutterHighlight.of({
              highlightSequences,
              indicateSequences,
              dim: dimLines.map(l => state.doc.line(l).from),
            }),
            addLineHighlight.of({
              highlight: highlightedLines?.map(l => state.doc.line(l).from) || [],
              // Filters out the highlighted lines
              indicate: indicatedLines?.filter(l => !highlightedLines?.includes(l)).map(l => state.doc.line(l).from) || [],
              dim: dimLines.map(l => state.doc.line(l).from),
            }),
          ]
        })
      },
      [
        editor,
        highlightedLines,
        indicatedLines,
      ],
    )

    useEffect(
      function configureLanguageExtensions() {
        if (!editor) return
        if (!languageSetup?.languageExtensions) return

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
      function configureThemeExtensions() {
        if (!editor) return

        editor.view.dispatch({
          effects: editor.themeExtensions.reconfigure(theme),
        })
        return () => {
          editor.view.dispatch({
            effects: editor.themeExtensions.reconfigure([]),
          })
        }
      },
      [editor, theme],
    )

    useEffect(
      function configureEditability() {
        if (!editor) return

        const extension = [
          EditorState.readOnly.of(isReadOnly),
          EditorView.editable.of(!isReadOnly),
          ...isReadOnly ? [] : [activeLineHighlighter()],
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
          if (!update.docChanged) return
          onContentChange?.(update.state.doc.toString())
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
      function configureGutterHoverChangeHandler() {
        if (!editor) return
        if (!onGutterHover) return

        const handleMouseMove = (event: MouseEvent) => {
          const state = editor.view.state
          const pos = editor.view.posAtCoords(event)
          if (pos) {
            let line = state.doc.lineAt(pos).number
            onGutterHover(line)
          } else {
            onGutterHover(undefined)
          }
        }

        const handleMouseLeave = (_: MouseEvent) => {
          onGutterHover(undefined)
        }

        const gutters = editor.view.dom.getElementsByClassName('cm-gutters').item(0) as HTMLElement
        if (!gutters) return

        gutters.addEventListener('mousemove', handleMouseMove)
        gutters.addEventListener('mouseleave', handleMouseLeave)
        return () => {
          gutters.removeEventListener('mousemove', handleMouseMove)
          gutters.removeEventListener('mouseleave', handleMouseLeave)
        }
      },
      [editor, onGutterHover],
    )

    useEffect(
      function configureGutterHoverChangeHandler() {
        if (!editor) return
        if (!onGutterClick) return

        const handleMouseDown = (event: MouseEvent) => {
          const state = editor.view.state
          const pos = editor.view.posAtCoords(event)
          if (pos) {
            let line = state.doc.lineAt(pos).number
            onGutterClick(line)
          } else {
            onGutterClick(undefined)
          }
        }

        const gutters = editor.view.dom.getElementsByClassName('cm-gutters').item(0) as HTMLElement
        if (!gutters) return

        gutters.addEventListener('mousedown', handleMouseDown)
        return () => {
          gutters.removeEventListener('mousedown', handleMouseDown)
        }
      },
      [editor, onGutterClick],
    )

    useEffect(
      function configureLanguageService() {
        if (!editor) return
        if (!filename) return
        if (!languageClient) return

        const { extension, dispose } = createExtension({
          client: languageClient,
          documentURI: getFileURI(filename),
          openFile: openFileInLanguageServer,
          onDiagnosticsChange: onDiagnosticsChange ? (ds) => onDiagnosticsChange(ds.map(d => ({ ...d, filename }))) : undefined,
          onHoverView,
        })

        editor.view.dispatch({
          effects: editor.languageServiceExtensions.reconfigure(extension),
        })

        return () => {
          editor.view.dispatch({
            effects: editor.languageServiceExtensions.reconfigure([]),
          })
          dispose()
        }
      },
      [
        editor,
        languageClient,
        filename,
        openFileInLanguageServer,
        onDiagnosticsChange,
        onHoverView,
      ],
    )

    return (
      <div
        // eslint-disable-next-line tailwindcss/no-custom-classname
        className={`editor overflow-auto ${className}`}
        ref={editorEl}
        style={{ ...(height && { height }) }}
      />
    )
  },
)

CodeEditor.displayName = 'CodeEditor'

export default CodeEditor
