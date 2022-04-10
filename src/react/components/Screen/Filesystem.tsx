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
import Splitter, { SplitDirection } from '@devbookhq/splitter'

import Header from '../Editor/Header'
import Separator from '../Separator'

import createEditorState from '../Editor/createEditorState'
import { Language } from '../Editor/language'
import FileExplorer from '../Filesystem/FileExplorer'
import SpinnerIcon from '../SpinnerIcon'
import Text from '../Text'

export interface Props {
  devbook: Pick<ReturnType<typeof useDevbook>, 'fs' | 'status'>
  initialFilepath?: string
  lightTheme?: boolean
  height?: string
}

function Filesystem({
  initialFilepath,
  devbook: {
    fs,
    status,
  },
  lightTheme,
  height,
}: Props) {
  const editorEl = useRef<HTMLDivElement>(null)
  const [initialContent, setInitialContent] = useState<string>()
  const [filepath, setFilepath] = useState(initialFilepath)
  const [sizes, setSizes] = useState([30, 70])

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
    <div
      className="flex-1 flex dark h-full w-full"
    >
      {!fs || status !== 'Connected' &&
        <div className="flex flex-1 items-center justify-center">
          <SpinnerIcon />
        </div>
      }
      {fs && status === 'Connected' &&
        <Splitter
          onResizeFinished={(_, sizes) => setSizes(sizes)}
          initialSizes={sizes}
          classes={['h-full flex min-w-0', 'h-full flex min-w-0']}
          draggerClassName="dark:bg-black-600 bg-gray-400"
          gutterClassName="dark:bg-black-800 bg-gray-500 hover:dark:bg-black-900 hover:bg-gray-600"
          direction={SplitDirection.Horizontal}
        >
          <div className="flex flex-1 min-w-0 max-h-full py-1 devbook-filesystem">
            <FileExplorer
              filesystem={fs}
              onOpenFile={setFilepath}
            />
          </div>
          <div className="flex flex-col flex-1 min-w-0 max-h-full">
            <div className="px-2 py-1 border-r flex">
              <Text
                mono
                hierarchy={Text.hierarchy.Secondary}
                size={Text.size.Small}
                text={filepath}
              />
            </div>
            <Separator
              variant={Separator.variant.CodeEditor}
              dir={Separator.dir.Horizontal}
            />
            <div className="h-full">
              {filepath && <div
                className="h-full"
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
        </Splitter>
      }
    </div>
  )
}

export default Filesystem
