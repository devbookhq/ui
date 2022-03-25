import {
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react'
import type { Terminal as XTermTerminal } from 'xterm'
import type {
  useDevbook,
  TerminalSession,
} from '@devbookhq/sdk'

export interface Opts {
  devbook: Pick<ReturnType<typeof useDevbook>, 'terminal' | 'status'>
  lightTheme?: boolean,
}

function useTerminal({
  devbook: {
    status,
    terminal: devbookTerminal,
  },
  lightTheme,
}: Opts) {
  const [terminal, setTerminal] = useState<XTermTerminal>()
  const [session, setSession] = useState<TerminalSession>()

  useEffect(function initialize() {
    async function init() {
      if (status !== "Connected") return
      if (!devbookTerminal) return

      const xterm = await import('xterm')

      const term = new xterm.Terminal({
        bellStyle: 'none',
        cursorStyle: 'block',
        theme: {
          background: lightTheme ? '#DEDEDE' : '#292929',
          foreground: lightTheme ? '#3C4A5D' : '#E9E9E9',
          cursor: lightTheme ? '#3C4A5D' : '#E9E9E9',
        },
      })
      const session = await devbookTerminal.createSession((data) => term.write(data))

      term.onData((data) => session.sendData(data))
      term.onResize((size) => session.resize(size))

      setTerminal(term)
      setSession(session)

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
  }, [
    status,
    devbookTerminal,
    lightTheme,
  ])

  return useMemo(() => {
    return {
      terminal,
      session,
    }
  }, [
    terminal,
    session,
  ])
}

export default useTerminal
