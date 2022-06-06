// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact'
import { useState } from 'preact/hooks'
// import { useState } from 'preact/hooks'
// import Splitter, { SplitDirection } from '@devbookhq/splitter'

import '../styles/embed.css'

import CodeEditor from './CodeEditor'
import Output from './Output'
import useSession from './useSession'

interface Props {
  code: string
  id: string
  title: string
}

function Embed({
  code: initialCode,
  id,
  title,
}: Props) {
  // const [sizes, setSizes] = useState<number[]>([85, 15])
  const [code, setCode] = useState<string>(initialCode)

  const {
    run,
    stop,
    csOutput,
  } = useSession({
    codeSnippetID: id,
    debug: true,
  })

  return (
    <div className="dbk-embed">
      <div className="
          flex
          flex-1
          flex-col
          overflow-hidden
          border
          border-black-700
          rounded-lg
        ">
        <div className="
            flex
            flex-row
            space-x-1
            py-1.5
            px-2
            rounded-t-lg
            bg-black-700
          ">
          {title}
        </div>
        <CodeEditor
          content={code}
          onContentChange={setCode}
        />
        <Output
          output={csOutput}
        />
      </div>
    </div>
  )
}

export default Embed
