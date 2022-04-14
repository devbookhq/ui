import { ReactNode, useCallback, useEffect, useState } from 'react'
import type {
  useDevbook,
} from '@devbookhq/sdk'
import Splitter from '@devbookhq/splitter'

import Iframe from './Iframe'
import Terminal, { Handler } from './Terminal'
import FileExplorer from '../Filesystem/FileExplorer'
import Editor from './Editor'
import { initAnalytics } from 'src/analytics'
import Separator from '../Separator'

export interface Props {
  devbook: Pick<ReturnType<typeof useDevbook>, 'fs' | 'status'>
  magicbellAPIKey: string
  magicbellAPISecret: string
}

function Screen({
  devbook,
  magicbellAPIKey,
  magicbellAPISecret,
}: Props) {
  const [sizes, setSizes] = useState([15, 40, 45])
  const [filepath, setFilepath] = useState<string>()

  useEffect(() => {
    initAnalytics({
      apiKey: magicbellAPIKey,
      apiSecret: magicbellAPISecret,
    })
  }, [
    magicbellAPIKey,
    magicbellAPISecret,
  ])

  const {
    fs,
  } = devbook

  const handleTerminalStart = useCallback((handler: Handler) => {
    handler.handleInput('./run.sh\n')
  }, [])

  if (!fs) return null

  return (
    <div className="bg-black-650 dark flex flex-1 h-full w-full">
      <Splitter
        onResizeFinished={(_, sizes) => setSizes(sizes)}
        initialSizes={sizes}
        classes={['flex min-w-0', 'flex min-w-0', 'flex min-w-0']}
        draggerClassName="dark:bg-black-600 bg-gray-400"
        gutterClassName="dark:bg-black-800 bg-gray-500 hover:dark:bg-black-900 hover:bg-gray-600"
      >
        <div className="flex flex-1 min-w-0 max-h-full py-1 devbook-filesystem">
          <FileExplorer
            filesystem={fs}
            onOpenFile={setFilepath}
          />
        </div>
        <Editor
          devbook={devbook}
          filepath={filepath}
        />
        <div className="bg-black-800 space-y-2 flex flex-col flex-1 min-w-0 max-h-full h-full">
          <Iframe
            devbook={devbook}
          />
          <Terminal
            devbook={devbook}
            onStart={handleTerminalStart}
            title=""
          />
        </div>
      </Splitter>
    </div>
  )
}

export default Screen
