import {
  useEffect,
  useState,
} from 'react'
import { Terminal } from 'xterm'
import type {
  DevbookStatus,
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
    async function init() {
      if (status !== "Connected") return
      if (!devbookTerminal) return

      const term = new Terminal({
        bellStyle: 'none',
        cursorStyle: 'block',
        fastScrollModifier: 'shift',
        rendererType: 'dom',
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
  ])

  return terminal
}

export default useTerminal
