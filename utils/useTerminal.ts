import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { Terminal as XTermTerminal } from 'xterm'
import {
  TerminalManager,
  TerminalSession,
} from '@devbookhq/sdk'

export interface Opts {
  terminalManager?: TerminalManager
}

function useTerminal({
  terminalManager,
}: Opts) {
  const [terminal, setTerminal] = useState<XTermTerminal>()
  const [terminalSession, setTerminalSession] = useState<TerminalSession>()
  const [error, setError] = useState<string>()

  useEffect(function initialize() {
    async function init() {
      if (!terminalManager) return

      const xterm = await import('xterm')

      const term = new xterm.Terminal({
        bellStyle: 'none',
        cursorStyle: 'block',
        theme: {
          background: '#292929',
          foreground: '#E9E9E9',
          cursor: '#E9E9E9',
        },
      })

      try {
        const session = await terminalManager.createSession((data) => term.write(data))

        term.onData((data) => session.sendData(data))
        term.onResize((size) => session.resize(size))

        setTerminal(term)
        setTerminalSession(session)
        setError(undefined)

        return () => {
          term.dispose()
          session.destroy()
          setTerminal(undefined)
        }
      } catch (err: any) {
        console.error(err.message)
        setError(err.message)
      }
    }

    const disposePromise = init()

    return () => {
      disposePromise.then((dispose) => dispose?.())
    }
  }, [terminalManager])

  return useMemo(() => {
    return {
      terminal,
      terminalSession,
      error,
    }
  }, [
    terminal,
    error,
    terminalSession,
  ])
}

export default useTerminal
