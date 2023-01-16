import { CodeSnippetExtendedState, CodeSnippetState, useSharedSession } from '@devbookhq/react'
import { Terminal as T, TerminalHandler } from '@devbookhq/terminal'
import { TerminalSquare } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'

import ExecutionButton from './ExecutionButton'

export function Icon() {
  return <TerminalSquare size="20px" />
}

export interface Props {
  cmd?: string
}

function Terminal({ cmd }: Props) {
  const ref = useRef<TerminalHandler>(null)

  const { session } = useSharedSession()

  const [cmdState, setCmdState] = useState<CodeSnippetState>(CodeSnippetExtendedState.Loading)

  const runCmd = useCallback(() => {
    if (!ref.current) return
    if (!cmd) return
    ref.current.runCmd(cmd)
  }, [cmd])

  const stopCmd = useCallback(() => {
    if (!ref.current) return
    ref.current.stopCmd()
  }, [])

  return (
    <div className="m-1 flex flex-1 flex-col space-y-2.5 overflow-hidden">
      {cmd && (
        <div>
          <ExecutionButton
            onStopClick={stopCmd}
            onRunClick={runCmd}
            state={cmdState}
          />
        </div>
      )}
      <div
        className="
    flex
    flex-1
    flex-col
    space-y-2
    overflow-hidden
    rounded-lg
    bg-[#15141a]
  "
      >
        <T
          session={session}
          ref={ref}
          onRunningCmdChange={s => setCmdState(s)}
          canStartTerminalSession
        />
      </div>
    </div>
  )
}

export default Terminal
