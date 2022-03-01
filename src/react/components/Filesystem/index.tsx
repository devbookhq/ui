import path from 'path'
import { EditorView } from '@codemirror/view'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type {
  useDevbook,
} from '@devbookhq/sdk'
import Splitter, { SplitDirection } from '@devbookhq/splitter'

import Header from '../Editor/Header'
import Separator from '../Separator'

import createEditorState from '../Editor/createEditorState'
import { Language } from '../Editor/language'
import FileExplorer from './FileExplorer'
import SpinnerIcon from '../SpinnerIcon'

export interface Props {
  devbook: ReturnType<typeof useDevbook>
  initialFilepath?: string
  lightTheme?: boolean
  height?: number // in px
}

function Filesystem({
  initialFilepath,
  devbook,
  lightTheme,
  height = 200,
}: Props) {
  const editorEl = useRef<HTMLDivElement>(null)
  const [initialContent, setInitialContent] = useState<string>()
  const [filepath, setFilepath] = useState(initialFilepath)

  const { fs, status } = devbook

  useEffect(() => {
    async function init() {
      if (!fs) return
      if (status !== "Connected") return
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
    if (status !== "Connected") return
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
    <div className={`rounded ${lightTheme ? '' : 'dark'}`}>
      <Header
        filepath={filepath || '/'}
      />
      <Separator
        variant={Separator.variant.CodeEditor}
        dir={Separator.dir.Horizontal}
      />
      <div
        className="flex-1 flex max-h-full min-w-0 overflow-auto devbook rounded-b bg-gray-300 dark:bg-black-650"
        style={{
          ...height && { height: `${height}px` },
        }}
      >
        <Splitter
          initialSizes={[40, 60]}
          classes={['flex', 'flex']}
          draggerClassName="dark:bg-black-600 bg-gray-600"
          gutterClassName="dark:bg-black-800 bg-gray-500"
          direction={SplitDirection.Horizontal}
        >
          <div className="flex flex-1 overflow-auto max-h-full">
            {fs && status === "Connected" &&
              <FileExplorer
                filesystem={fs}
                onOpenFile={setFilepath}
              />
            }
            {!fs || status !== "Connected" &&
              <div className="flex flex-1 items-center justify-center">
                <SpinnerIcon />
              </div>
            }
          </div>
          <div
            className={`flex-1 max-h-full overflow-auto flex min-w-0 devbook`}
            ref={editorEl}
          />
        </Splitter>
      </div>
    </div>
  )
}

export default Filesystem
