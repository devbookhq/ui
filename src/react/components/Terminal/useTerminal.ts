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
}

function useTerminal({
  devbook: {
    status,
    terminal: devbookTerminal,
  },
}: Opts) {
  const [terminal, setTerminal] = useState<Terminal>()

  useEffect(function initialize() {
    if (status !== "Connected") return
    if (!devbookTerminal) return

    const term = new Terminal({})

    const session = devbookTerminal.createSession((data) => term.write(data))
    term.onData((data) => session.sendData(data))
    term.onResize((size) => session.resize(size))

    setTerminal(term)

    return () => {
      term.dispose()
      session.destroy()
    }
  }, [
    status,
    devbookTerminal,
  ])

  return terminal
}

export default useTerminal
