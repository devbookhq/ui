import { useSession, SharedSessionProvider } from '@devbookhq/react'
import Splitter, { SplitDirection, GutterTheme } from '@devbookhq/splitter'
import { useState, useCallback, useEffect } from 'react'

import '@devbookhq/terminal/dist/index.css'
import '@devbookhq/code-editor/dist/index.css'

import { CodeLayout, CompiledAppContent } from 'apps/content'
import AppFileEditor from './AppFileEditor'
import { OpenedFile } from './AppFileEditor/reducer'
import AppContentView from './AppContentView'

export interface Props {
  content: CompiledAppContent
}

const defaultAppEnv = 'A22MmpUQaIUo'

function AppPage({ content }: Props) {
  const [initialOpenedFiles, setInitialOpenedFiles] = useState<OpenedFile[]>([])
  const [splitterSizes, setSplitterSizes] = useState([0, 100])
  const [isSplitterDirty, setIsSplitterDirty] = useState(false) // True if user manually resized splitter.
  const sessionHandle = useSession({
    codeSnippetID: content.environmentID || defaultAppEnv,
    debug: process.env.NODE_ENV === 'development',
    inactivityTimeout: 0,
  })

  const handleResizeFinished = useCallback((_: number, newSizes: number[]) => {
    setIsSplitterDirty(true)
    setSplitterSizes(newSizes)
  }, [])

  useEffect(function loadInitialOpenedFiles() {
    if (!sessionHandle.session?.filesystem) return

    const filePaths = (content.layout as CodeLayout).props?.tabs?.map(t => t.path) || []
    if (filePaths.length === 0) {
      setInitialOpenedFiles([])
      if (!isSplitterDirty) {
        setSplitterSizes([0, 100])
      }
      return
    }

    const promisedContents: Promise<string>[] = []
    const ofs: OpenedFile[] = []
    for (const fp of filePaths) {
      ofs.push({
        path: fp,
        content: '',
        canBeClosed: false,
      })
      promisedContents.push(sessionHandle.session.filesystem.read(fp))
    }

    Promise.all(promisedContents)
      .then(contents => {
        for (let i = 0; i < contents.length; i++) {
          ofs[i].content = contents[i]
        }
        setInitialOpenedFiles(ofs)
        // Open the file editor so it's visible to user
        if (!isSplitterDirty) {
          setSplitterSizes([40, 60])
        }
      })
  }, [
    sessionHandle.session,
    isSplitterDirty,
    content.layout,
  ])

  return (
    <SharedSessionProvider session={sessionHandle}>
      <div className="
          flex
          flex-1
          w-full
          flex-col
          overflow-hidden
        ">
        <Splitter
          classes={['flex', 'flex lg:min-w-[500px]']}
          direction={SplitDirection.Horizontal}
          draggerClassName="w-[2px] rounded-full bg-gray-500 group-hover:bg-gray-400"
          gutterClassName="group px-0.5 transition-all bg-gray-900 border-x border-gray-800 hover:bg-gray-800 z-40"
          gutterTheme={GutterTheme.Dark}
          initialSizes={splitterSizes}
          onResizeFinished={handleResizeFinished}
        >
          <AppFileEditor
            initialOpenedFiles={initialOpenedFiles}
          />
          <AppContentView
            content={content}
          />
        </Splitter>
      </div>
    </SharedSessionProvider>
  )
}

export default AppPage
