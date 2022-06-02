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
      const session = await terminalManager.createSession((data) => term.write(data))

      term.onData((data) => session.sendData(data))
      term.onResize((size) => session.resize(size))

      setTerminal(term)
      setTerminalSession(session)

      return () => {
        term.dispose()
        session.destroy()
        setTerminal(undefined)
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
    }
  }, [
    terminal,
    terminalSession,
  ])
}

export default useTerminal
