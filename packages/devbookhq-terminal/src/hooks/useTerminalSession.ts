import {
  TerminalManager,
  TerminalSession,
} from '@devbookhq/sdk'
import {
  useEffect,
  useState,
} from 'react'
import type { Terminal as XTermTerminal } from 'xterm'

export interface UseTerminalSessionOpts {
  terminalManager?: TerminalManager
  canStart: boolean
  terminal?: XTermTerminal
  onOutput?: (output: string) => void
}

function useTerminalSession({
  terminalManager,
  canStart,
  terminal,
  onOutput,
}: UseTerminalSessionOpts) {
  const [terminalSession, setTerminalSession] = useState<{ session: TerminalSession, toggleIO: (willBeEnabled: boolean) => void }>()

  useEffect(function initialize() {
    async function init() {
      if (!terminalManager) return
      if (!canStart) return
      if (!terminal) return

      await new Promise<void>((res, rej) => {
        terminal.writeln('', res)
      })

      setTimeout(() => terminal.clear(), 0)

      let isEnabled = true

      try {
        const session = await terminalManager.createSession({
          onData: data => {
            if (!isEnabled) return
            terminal.write(data)
            onOutput?.(data)
          },
          size: {
            cols: terminal.cols,
            rows: terminal.rows,
          },
        })

        const disposeOnData = terminal.onData(data => {
          if (!isEnabled) return
          session.sendData(data)
        })
        const disposeOnResize = terminal.onResize(size => {
          if (!isEnabled) return
          session.resize(size)
        })

        const toggleIO = (willBeEnabled: boolean) => {
          isEnabled = willBeEnabled
          if (willBeEnabled) {
            session.resize({
              cols: terminal.cols,
              rows: terminal.rows,
            })
          }
        }

        setTerminalSession({
          session,
          toggleIO,
        })

        return () => {
          disposeOnData.dispose()
          disposeOnResize.dispose()
          session.destroy()
          setTerminalSession(s => s?.session === session ? undefined : s)
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : JSON.stringify(err)
        console.error(message)
      }
    }

    const disposePromise = init()

    return () => {
      disposePromise.then(dispose => dispose?.())
    }
  }, [
    terminalManager,
    canStart,
    onOutput,
    terminal,
  ])

  return terminalSession
}

export default useTerminalSession
