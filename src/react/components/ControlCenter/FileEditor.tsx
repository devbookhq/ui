import path from 'path'
import { EditorView } from '@codemirror/view'
import { useCallback, useEffect, useMemo, useRef, useState, KeyboardEvent } from 'react'
import createEditorState from '../Editor/createEditorState'
import { Language } from '../Editor/language'
import { useDevbook, Env, DevbookStatus } from '@devbookhq/sdk'

export interface Props {
  devbook: ReturnType<typeof useDevbook>
  filepath: string
  onFilepathChange: (filepath: string) => void
}

function FileEditor({
  filepath,
  onFilepathChange,
  devbook: {
    fs,
    status,
  },
}: Props) {
  const editorEl = useRef<HTMLDivElement>(null)
  const [initialContent, setInitialContent] = useState<string>()

  useEffect(() => {
    async function init() {
      if (!fs) return
      if (status !== DevbookStatus.Connected) return
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
    if (status !== DevbookStatus.Connected) return

    try {
      await fs.write(filepath, content)
    } catch (err: any) {
      console.error(err)
    }

  }, [fs, status, filepath])

  const language = useMemo(() => {
    if (!filepath) return
    const ext = path.extname(filepath).replace('.', '')
    return Language[ext as keyof typeof Language] || Language.tsx
  }, [filepath])

  useEffect(function initEditor() {
    if (!editorEl.current) return
    if (!filepath) return

    const state = createEditorState({
      initialContent,
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
    parent,
    language,
    saveFile,
  ])

  function handleInputChange(e: any) {
    onFilepathChange(e.target.value)
    setInitialContent('')
  }

  return (
    <div className="dark bg-black-650 flex flex-1 flex-col space-y-1">
      <input
        className="
          py-1.5
          px-0.5
          pl-[10px]
          bg-black-600
          min-w-0
          flex 
          placeholder:text-denim-400
          dark:placeholder:text-gray-700
          text-2xs
          font-400
          font-mono
          text-denim-700
          dark:text-gray-200
          outline-none
        "
        value={filepath}
        onChange={handleInputChange}
        placeholder="/<filename>"
      />
      <div
        className={`flex-1 max-h-full overflow-auto flex min-w-0 devbook`}
        ref={editorEl}
      />
    </div>
  )
}

export default FileEditor
