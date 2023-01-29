import { Loader as LoaderIcon } from 'lucide-react'
import {
  Terminal,
  TerminalHandler,
  TerminalProcess,
} from '@devbookhq/terminal'
import {
  useCallback,
  useRef,
  useState,
} from 'react'
import { useSharedSession } from '@devbookhq/react'

// import { analytics } from 'utils/analytics'
import CopyToClipboardButton from '../CopyToClipboardButton'
import RunButton from '../RunButton'
import StopButton from '../StopButton'
// import useTerminalOutputAnalytics from 'utils/analytics/useTerminalOutputAnalytics'

export interface Props {
  rootdir: string
  cmd: string
  // tooltips: { [name: string]: string }
  // placeholder: string
}

function TerminalCommand({
  rootdir,
  cmd,
}: Props) {
  const termRef = useRef<TerminalHandler>(null)
  const { session } = useSharedSession()
  const [isRunning, setIsRunning] = useState(false)
  const [process, setProcess] = useState<TerminalProcess>()

  const handleCopyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(cmd)
    // analytics.track('guide terminal copied', { cmd })
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

    // analytics.track('guide terminal command started', { cmd })

    await process?.exited
    setIsRunning(false)
  }, [cmd])

  const stop = useCallback(async () => {
    await process?.kill()
    setIsRunning(false)
    // analytics.track('guide terminal command stopped', { cmd })
  }, [process, cmd])

  const handleTerminalUserLine = useCallback((line: string) => {
    const [, cmd] = line.split('$')
    if (!cmd) return
    const trimmedCmd = cmd.trim()
    if (trimmedCmd.length > 0) {
      // analytics.track('guide terminal line written', { cmd: trimmedCmd })
    }
  }, [])

  const handleTerminalCopy = useCallback((selection: string) => {
    if (selection.length > 0) {
      // analytics.track('guide terminal selection copied', { selection })
    }
  }, [])

  // const { handleOutput } = useTerminalOutputAnalytics()

  return (
    <div className="
      flex
      flex-col
    ">
      <div className="
        flex
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
        <Terminal
          ref={termRef}
          rootdir={rootdir}
          onCopy={handleTerminalCopy}
          onLine={handleTerminalUserLine}
          // onOutput={handleOutput}
          session={session}
          // onRunningCmdChange
          isPersistent
          canStartTerminalSession
        />
      </div>
    </div>
  )
}

export default TerminalCommand
