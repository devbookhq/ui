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
import FileExplorer from './FileExplorer'
import SpinnerIcon from '../SpinnerIcon'
import Text from '../Text'

export interface Props {
  devbook: Pick<ReturnType<typeof useDevbook>, 'fs' | 'status'>
  initialFilepath?: string
  lightTheme?: boolean
  height?: string
}

function Filesystem({
  initialFilepath = '/',
  devbook: {
    fs,
    status,
  },
  lightTheme,
  height = '200px',
}: Props) {
  const editorEl = useRef<HTMLDivElement>(null)
  const [initialContent, setInitialContent] = useState<string>()
  const [filepath, setFilepath] = useState(initialFilepath)
  const [sizes, setSizes] = useState([40, 60])

  console.log('FILES')

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
          ...height && { height },
        }}
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
            minWidths={[50, 50]}
            classes={['flex min-w-0', 'flex min-w-0']}
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
            <div className="flex-1 max-h-full flex min-w-0">
              {filepath && <div
                className="flex-1 max-h-full overflow-auto flex min-w-0 devbook"
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
          </Splitter>
        }
      </div>
    </div>
  )
}

export default Filesystem
