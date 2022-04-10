import path from 'path'
import { EditorView } from '@codemirror/view'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type {
  useDevbook,
} from '@devbookhq/sdk'

import createEditorState from '../Editor/createEditorState'
import { Language } from '../Editor/language'
import Text from '../Text'

export interface Props {
  devbook: Pick<ReturnType<typeof useDevbook>, 'fs' | 'status'>
  filepath?: string
  lightTheme?: boolean
  height?: string
}

function Editor({
  filepath,
  devbook: {
    fs,
    status,
  },
}: Props) {
  const editorEl = useRef<HTMLDivElement>(null)
  const [initialContent, setInitialContent] = useState<string>()

  useEffect(function initSelectedFileContent() {
    async function init() {
      if (!fs) return
      if (status !== 'Connected') return
      if (!filepath) return

      const content = await fs.get(filepath)
      setInitialContent(content)
    }
    init()
  }, [
    status,
    fs,
    filepath,
  ])

  const saveFile = useCallback(async (content) => {
    if (!filepath) return
    if (status !== 'Connected') return
    if (!fs) return

    try {
      await fs.write(filepath, content)
    } catch (err: any) {
      console.error(err)
    }
  }, [
    fs,
    status,
    filepath,
  ])

  const language = useMemo(() => {
    if (!filepath) return
    const ext = path.extname(filepath).replace('.', '')
    return Language[ext as keyof typeof Language] || Language.tsx
  }, [filepath])

  useLayoutEffect(function initEditor() {
    if (!editorEl.current) return
    if (!filepath) return

    const state = createEditorState({
      initialContent: initialContent || '',
      language,
      onContentChange(content) {
        saveFile(content)
      },
    })

    const view = new EditorView({ state, parent: editorEl.current });
    return () => {
      view.destroy()
    }
  }, [
    initialContent,
    language,
    saveFile,
  ])

  return (
    <div className="flex flex-col flex-1 min-w-0 max-h-full devbook h-full">
      <div className="flex items-start bg-black-800">
        <div className="min-w-[100px] px-2 py-1 border-black-600 bg-black-650 items-center">
          <Text
            mono
            hierarchy={Text.hierarchy.Secondary}
            size={Text.size.Small}
            text={filepath}
          />
        </div>
      </div>
      <div className="flex flex-1 overflow-auto min-w-0">
        {filepath && <div
          className="w-full h-full"
          ref={editorEl}
        />}
        {!filepath &&
          <div className="flex flex-1 items-center justify-center p-2 text-center">
            <Text
              text="No file selected"
              hierarchy={Text.hierarchy.Secondary}
            />
          </div>
        }
      </div>
    </div>
  )
}

export default Editor
