import { ChildProcess, TerminalManager, TerminalSession } from '@devbookhq/sdk'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Terminal as XTermTerminal } from 'xterm'

export interface Opts {
  terminalManager?: TerminalManager
}

function useTerminal({ terminalManager }: Opts) {
  const [terminal, setTerminal] = useState<XTermTerminal>()
  const [terminalSession, setTerminalSession] = useState<TerminalSession>()
  const [error, setError] = useState<string>()
  const [isLoading, setIsLoading] = useState(true)
  const [childProcesses, setChildProcesss] = useState<ChildProcess[]>([])
  const [runningProcessCmd, setRunningProcessCmd] = useState<string>()
  const [cmd, setCmd] = useState<{ cmdContent?: string; wasExecuted?: boolean }>({})
  const runningProcessID = useMemo(() => {
    if (runningProcessCmd && childProcesses.length > 0) {
      return childProcesses[0].pid
    }
    return undefined
  }, [runningProcessCmd, childProcesses])

  const runCmd = useCallback(async (cmd: string) => {
    setCmd({ cmdContent: cmd, wasExecuted: false })
  }, [])

  const stopCmd = useCallback(() => {
    if (!runningProcessID) return

    terminalManager?.killProcess(runningProcessID)
  }, [runningProcessID, terminalManager])

  useEffect(
    function initialize() {
      async function init() {
        if (!terminalManager) return

        setRunningProcessCmd(undefined)
        setChildProcesss([])

        setIsLoading(true)
        const xterm = await import('xterm')

        const term = new xterm.Terminal({
          cursorStyle: 'block',
          allowProposedApi: true,
          fontSize: 13,
          theme: {
            background: '#15141a',
            foreground: '#FFFFFF',
            cursor: '#FFFFFF',
          },
        })

        try {
          const session = await terminalManager.createSession({
            onData: data => term.write(data),
            onChildProcessesChange: setChildProcesss,
            size: { cols: term.cols, rows: term.rows },
          })

          term.onData(data => session.sendData(data))
          term.onResize(size => session.resize(size))

          setTerminal(term)
          setTerminalSession(session)
          setError(undefined)
          setIsLoading(false)

          return () => {
            term.dispose()
            session.destroy()
            setTerminal(undefined)
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err)
          console.error(message)
          setError(message)
        } finally {
          setIsLoading(false)
        }
      }

      const disposePromise = init()

      return () => {
        setChildProcesss([])
        setRunningProcessCmd(undefined)
        disposePromise.then(dispose => dispose?.())
      }
    },
    [terminalManager],
  )

  useEffect(
    function executeCmd() {
      if (!cmd.wasExecuted && cmd.cmdContent && terminalSession) {
        setRunningProcessCmd(cmd.cmdContent)
        ;(async function () {
          try {
            await terminalSession?.sendData('\x0C' + cmd.cmdContent + '\n')
            setCmd(c => ({ cmdContent: c.cmdContent, wasExecuted: true }))
          } catch (e) {
            setRunningProcessCmd(undefined)
          }
        })()
      }
    },
    [cmd, terminalSession],
  )

  return useMemo(
    () => ({
      terminal,
      terminalSession,
      error,
      isLoading,
      stopCmd,
      isCmdRunning: !!runningProcessID,
      runCmd,
      childProcesses,
    }),
    [
      terminal,
      childProcesses,
      isLoading,
      error,
      runningProcessID,
      stopCmd,
      runCmd,
      terminalSession,
    ],
  )
}

export default useTerminal
