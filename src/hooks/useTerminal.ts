import { ChildProcess, TerminalManager, TerminalSession } from '@devbookhq/sdk'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Terminal as XTermTerminal } from 'xterm'

export interface Opts {
  terminalManager?: TerminalManager
}

function useTerminal({ terminalManager }: Opts) {
  const [cmd, setCmd] = useState<{ cmdContent?: string; wasExecuted?: boolean }>({})
  const [runningProcessCmd, setRunningProcessCmd] = useState<string>()

  const [terminalState, setTerminalState] = useState<{
    terminal?: XTermTerminal
    session?: TerminalSession
    error?: string
    isLoading?: boolean
    childProcesses: ChildProcess[]
  }>({ childProcesses: [], isLoading: true })

  const runningProcessID = useMemo(() => {
    if (runningProcessCmd && terminalState.childProcesses.length > 0) {
      return terminalState.childProcesses[0].pid
    }
    return undefined
  }, [runningProcessCmd, terminalState.childProcesses])

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

        setTerminalState({
          childProcesses: [],
          isLoading: true,
          error: undefined,
        })

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

        setTerminalState({
          childProcesses: [],
          isLoading: true,
          terminal: term,
          error: undefined,
        })

        try {
          const session = await terminalManager.createSession({
            onData: data => term.write(data),
            onChildProcessesChange: cps => {
              setTerminalState(s =>
                s.terminal === term ? { ...s, childProcesses: cps } : s,
              )
            },
            size: { cols: term.cols, rows: term.rows },
          })

          term.onData(data => session.sendData(data))
          term.onResize(size => session.resize(size))

          setTerminalState(s =>
            s.terminal === term ? { ...s, session, isLoading: false } : s,
          )

          return () => {
            term.dispose()
            session.destroy()
            setTerminalState(s =>
              s.terminal === term ? { isLoading: false, childProcesses: [] } : s,
            )
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err)
          console.error(message)
          setTerminalState(s => (s.terminal === term ? { ...s, error: message } : s))
        } finally {
          setTerminalState(s => (s.terminal === term ? { ...s, isLoading: false } : s))
        }
      }

      const disposePromise = init()

      return () => {
        setTerminalState({
          childProcesses: [],
          isLoading: false,
        })
        setRunningProcessCmd(undefined)
        disposePromise.then(dispose => dispose?.())
      }
    },
    [terminalManager],
  )

  useEffect(
    function executeCmd() {
      if (!cmd.wasExecuted && cmd.cmdContent && terminalState.session) {
        setRunningProcessCmd(cmd.cmdContent)
        ;(async function () {
          try {
            await terminalState.session?.sendData('\x0C' + cmd.cmdContent + '\n')
            setCmd(c => ({ cmdContent: c.cmdContent, wasExecuted: true }))
          } catch (e) {
            setRunningProcessCmd(undefined)
          }
        })()
      }
    },
    [cmd, terminalState.session],
  )

  return {
    terminal: terminalState.terminal,
    terminalSession: terminalState.session,
    error: terminalState.error,
    isLoading: terminalState.isLoading,
    stopCmd,
    isCmdRunning: !!runningProcessID,
    runCmd,
    childProcesses: terminalState.childProcesses,
  }
}

export default useTerminal
