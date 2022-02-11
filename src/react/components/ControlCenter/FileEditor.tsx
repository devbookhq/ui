import path from 'path'
import { EditorView } from '@codemirror/view'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import createEditorState from '../Editor/createEditorState'
import { Language } from '../Editor/language'
import { useDevbook, DevbookStatus } from '@devbookhq/sdk'
import Filesystem from '../Filesystem/Filesystem'

export interface Props {
  devbook: ReturnType<typeof useDevbook>
  filepath: string
  onFilepathChange: (filepath: string) => void
}

function FileEditor({
  filepath,
  onFilepathChange,
  devbook,
}: Props) {
  const editorEl = useRef<HTMLDivElement>(null)
  const [initialContent, setInitialContent] = useState<string>()

  const { fs, status } = devbook

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
    if (!fs) return

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

  return (
    <div className="dark bg-black-650 flex flex-1 space-y-1">
      <div className="">
        {fs &&
          <Filesystem
            filesystem={fs}
            onOpenFile={onFilepathChange}
          />
        }
      </div>
      <div
        className={`flex-1 max-h-full overflow-auto flex min-w-0 devbook`}
        ref={editorEl}
      />
    </div>
  )
}

export default FileEditor
