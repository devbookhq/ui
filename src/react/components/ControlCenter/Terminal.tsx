import { Devbook, useDevbook } from '@devbookhq/sdk'
import { useState } from 'react'
import IconButton from '../IconButton'
import Text from '../Text'

export interface Props {
  devbook: ReturnType<typeof useDevbook>
}

function Terminal({
  devbook: {
    stdout,
    stderr,
    runCmd,
  },
}: Props) {
  const [cmd, setCmd] = useState<string>()

  function run() {
    if (cmd) {
      runCmd(cmd)
    }
  }



  return (
    <div className="flex items-center space-x-2 py-2 px-1 min-w-0">
      <IconButton
        onMouseDown={run}
        icon={<Text size={Text.size.Small} text="Run" />}
      />
    </div>
  )
}

export default Terminal
