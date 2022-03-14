import {
  useRef,
  useEffect,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react'
import type { TerminalSession, useDevbook } from '@devbookhq/sdk'
import { FitAddon } from 'xterm-addon-fit'
import { WebLinksAddon } from 'xterm-addon-web-links'
import { Terminal as XTermTerminal } from 'xterm'

import Header from '../Editor/Header'
import Separator from '../Separator'
import useTerminal from './useTerminal'
import SpinnerIcon from '../SpinnerIcon'

export interface Props {
  devbook: Pick<ReturnType<typeof useDevbook>, 'terminal' | 'status'>
  height?: string
  lightTheme?: boolean
  autofocus?: boolean
  onStart?: (context: { session: TerminalSession, terminal: XTermTerminal }) => (Promise<void> | void)
}

export interface Handler {
  executeCmd: (cmd: string) => void
  focus: () => void
}

const Terminal = forwardRef<Handler, Props>(({
  devbook,
  height,
  lightTheme,
  onStart,
  autofocus,
}, ref) => {
  const terminalEl = useRef<HTMLDivElement>(null)
  const { terminal, session } = useTerminal({ devbook, lightTheme, onStart })
  const [isLoading, setIsLoading] = useState(true)

  const executeCmd = useCallback((cmd: string) => {
    if (!session) return

    session.sendData(cmd)
  }, [session])

  useImperativeHandle(ref, () => ({
    executeCmd,
    focus: () => {
      console.log('focus')
      terminal?.focus()
    },
  }), [
    executeCmd,
    terminal,
  ])

  useEffect(function attachTerminal() {
    if (!terminalEl.current) return
    if (!terminal) return

    terminal.loadAddon(new WebLinksAddon())

    const fitAddon = new FitAddon()
    terminal.loadAddon(fitAddon)

    terminal.open(terminalEl.current)
    fitAddon.fit()

    setIsLoading(false)

    if (autofocus) {
      terminal.focus()
    }

    return () => {
      setIsLoading(true)
    }
  }, [
    terminal,
    autofocus,
  ])

  return (
    <div
      className={`rounded flex flex-col min-w-0 flex-1 ${lightTheme ? '' : 'dark'}`}
    >
      <Header
        filepath="> Terminal"
      />
      <Separator
        variant={Separator.variant.CodeEditor}
        dir={Separator.dir.Horizontal}
      />
      <div
        className="rounded-b flex flex-1 min-w-0 bg-gray-300 dark:bg-black-650 pt-2 pl-4"
        style={{
          ...height && { minHeight: height, maxHeight: height },
        }}
      >
        <div
          className="flex flex-1 min-w-0"
          ref={terminalEl}
        >
          {isLoading &&
            <div
              className="flex flex-1 justify-center items-center max-h-full min-w-0"
            >
              <SpinnerIcon />
            </div>
          }
        </div>
      </div>
    </div>
  )
})

export default Terminal
