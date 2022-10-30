import { Terminal as T, useProvidedSession } from '@devbookhq/react'
import { CodeSnippetExecState } from '@devbookhq/sdk'
import { TerminalSquare } from 'lucide-react'
import { useCallback, useMemo, useRef, useState } from 'react'

import ExecutionButton from './ExecutionButton'

export type SessionState = 'closed' | 'opening' | 'open'

export enum CodeSnippetExtendedState {
  Failed = 'Failed',
  Loading = 'Loading',
}

export type CodeSnippetState = CodeSnippetExtendedState | CodeSnippetExecState

interface Handler {
  handleInput: (input: string) => void
  focus: () => void
  resize: () => void
  runCmd: (cmd: string) => Promise<void>
  stopCmd: () => void
}

export function Icon() {
  return <TerminalSquare size="20px" />
}

export interface Props {
  cmd?: string
}

function Terminal({ cmd }: Props) {
  const ref = useRef<Handler>(null)

  const { state: sessionState } = useProvidedSession()

  const [cmdState, setCmdState] = useState<CodeSnippetExecState>(
    CodeSnippetExecState.Stopped,
  )

  const executionState = useMemo<CodeSnippetState>(() => {
    switch (sessionState) {
      case 'closed':
        return CodeSnippetExecState.Stopped
      case 'opening':
        return CodeSnippetExtendedState.Loading
      case 'open':
        return cmdState
    }
  }, [cmdState, sessionState])

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
            state={executionState}
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
          ref={ref}
          onRunningCmdChange={setCmdState}
        />
      </div>
    </div>
  )
}

export default Terminal
