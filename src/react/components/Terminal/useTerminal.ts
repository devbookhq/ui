import {
  useEffect,
  useState,
} from 'react'
import { Terminal } from 'xterm'
import type {
  useDevbook,
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
  const [terminal, setTerminal] = useState<Terminal>()

  useEffect(function initialize() {
    async function init() {
      if (status !== "Connected") return
      if (!devbookTerminal) return

      const term = new Terminal({
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
    devbookTerminal,
    lightTheme,
  ])

  return terminal
}

export default useTerminal
