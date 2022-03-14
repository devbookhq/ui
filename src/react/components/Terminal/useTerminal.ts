import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Terminal as XTermTerminal } from 'xterm'
import type {
  useDevbook,
  TerminalSession,
} from '@devbookhq/sdk'

export interface Opts {
  devbook: Pick<ReturnType<typeof useDevbook>, 'terminal' | 'status'>
  onStart?: (context: { session: TerminalSession, terminal: XTermTerminal }) => (Promise<void> | void)
  lightTheme?: boolean,
}

function useTerminal({
  devbook: {
    status,
    terminal: devbookTerminal,
  },
  lightTheme,
  onStart,
}: Opts) {
  const [terminal, setTerminal] = useState<XTermTerminal>()
  const [session, setSession] = useState<TerminalSession>()

  useEffect(function initialize() {
    async function init() {
      if (status !== "Connected") return
      if (!devbookTerminal) return

      const term = new XTermTerminal({
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

      await onStart?.({ session, terminal: term })

      setTerminal(term)
      setSession(session)

      return () => {
        term.dispose()
        session.destroy()
      }
    }

    const disposePromise = init()

    return () => {
      disposePromise.then((dispose) => dispose?.())
    }
  }, [
    status,
    onStart,
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
