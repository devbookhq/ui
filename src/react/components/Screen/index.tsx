import type {
  useDevbook,
} from '@devbookhq/sdk'
import Splitter from '@devbookhq/splitter'

import Iframe from './Iframe'
import Terminal from './Terminal'
import Text from '../Text'
import { useEffect, useState } from 'react'
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

  if (!fs) return null

  return (
    <div className="flex-1 flex min-w-0 devbook bg-black-650 dark flex-col max-h-full">
      <div className="border-b border-black-600 py-2 px-4 bg-black-650">
        <Text
          text="Devbook"
          hierarchy={Text.hierarchy.Primary}
          size={Text.size.Medium}
        />
      </div>
      <div className="flex flex-1 min-w-0">
        <div className="w-12 bg-black-650">
        </div>
        <Separator dir={Separator.dir.Vertical} variant={Separator.variant.CodeEditor} />
        <Splitter
          onResizeFinished={(_, sizes) => setSizes(sizes)}
          initialSizes={sizes}
          classes={['max-h-full h-full', 'max-h-full h-full', 'max-h-full h-full']}
          draggerClassName="dark:bg-black-600 bg-gray-400"
          gutterClassName="dark:bg-black-800 bg-gray-500 hover:dark:bg-black-900 hover:bg-gray-600 h-full"
        >
          <div className="flex flex-1 min-w-0 max-h-full h-full py-1 overflow-hidden">
            <FileExplorer
              filesystem={fs}
              onOpenFile={setFilepath}
            />
          </div>
          <Editor
            devbook={devbook}
            filepath={filepath}
          />
          <div className="flex flex-1 flex-col h-full bg-black-800 space-y-2">
            <Iframe
              url="https://www.openstreetmap.org/export/embed.html?bbox=-0.004017949104309083%2C51.47612752641776%2C0.00030577182769775396%2C51.478569861898606&layer=mapnik"
            />
            <Terminal
              devbook={devbook}
              title=""
            />
          </div>
        </Splitter>
      </div>
    </div>
  )
}

export default Screen
