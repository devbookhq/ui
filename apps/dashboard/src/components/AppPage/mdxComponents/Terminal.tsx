import { Loader as LoaderIcon } from 'lucide-react'
import {
  Terminal as Term,
  TerminalHandler,
  TerminalProcess,
} from '@devbookhq/terminal'
import {
  useCallback,
  useRef,
  useState,
} from 'react'
import { useSharedSession } from '@devbookhq/react'

import CopyToClipboardButton from '../CopyToClipboardButton'
import RunButton from '../RunButton'
import StopButton from '../StopButton'
import { rootdir as root } from 'utils/constants'

export interface Props {
  rootdir?: string
  cmd: string
}

function Terminal({
  rootdir = root,
  cmd,
}: Props) {
  const termRef = useRef<TerminalHandler>(null)
  const { session } = useSharedSession()
  const [isRunning, setIsRunning] = useState(false)
  const [process, setProcess] = useState<TerminalProcess>()

  const handleCopyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(cmd)
  }, [cmd])

  const run = useCallback(async () => {
    termRef.current?.clear()
    // This is a hack that allows us keep track if a command has finished running.
    // Instead of just writing command into an input and simulating pressing an enter,
    // we move the cursor in a way that it looks like an enter was pressed but we run
    // the command in a separate PTY and stream the output into the frontend terminal
    // instance.
    setIsRunning(true)
    await termRef.current?.write(cmd + '\n\x1B[1G')
    const process = await termRef.current?.runCmd(cmd)
    setProcess(process)

    await process?.exited
    setIsRunning(false)
  }, [cmd])

  const stop = useCallback(async () => {
    await process?.kill()
    setIsRunning(false)
  }, [process])

  return (
    <div className="
      flex
      flex-col
      flex-1
    ">
      <div className="
        flex
        flex-1
        space-x-2
        items-center
        py-1
        px-3
        border
        border-indigo-400/20
        bg-gray-800
        rounded-t-lg
        rounded-b-none
      ">
        {!isRunning ? (
          <span className="text-gray-600 font-mono text-sm">$</span>
        ) : (
          <LoaderIcon
            className="
              text-gray-500
              animate-spin
            "
            size={14}
          />
        )}
        <pre className="
          flex-1
          m-0
          p-0
          bg-transparent
          font-mono
          whitespace-pre-wrap
          text-sm
        ">
          {cmd}
        </pre>
        <div className="
          flex
          items-center
          space-x-1
        ">
          <>
            {!isRunning ? (
              <RunButton
                onClick={run}
              />
            ) : (
              <StopButton
                onClick={stop}
              />
            )}
          </>
          <CopyToClipboardButton
            onClick={handleCopyToClipboard}
          />
        </div>
      </div>
      <div className="
        relative
        flex
        h-[200px]
        overflow-hidden
        rounded-t-none
        rounded-b-lg
      ">
        <Term
          ref={termRef}
          rootdir={rootdir}
          session={session}
          isPersistent
          canStartTerminalSession
        />
      </div>
    </div>
  )
}

export default Terminal
