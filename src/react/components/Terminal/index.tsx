import {
  useRef,
  useLayoutEffect,
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
  title?: string
  autofocus?: boolean
  onStart?: (context: { session: TerminalSession, terminal: XTermTerminal }) => (Promise<void> | void)
}

export interface Handler {
  handleInput: (input: string) => void
  focus: () => void
}

const Terminal = forwardRef<Handler, Props>(({
  devbook,
  height,
  lightTheme,
  onStart,
  autofocus,
  title = '> Terminal',
}, ref) => {
  const terminalEl = useRef<HTMLDivElement>(null)
  const { terminal, session } = useTerminal({ devbook, lightTheme, onStart })
  const [isLoading, setIsLoading] = useState(true)

  const handleInput = useCallback((input: string) => session?.sendData(input), [session])

  useImperativeHandle(ref, () => ({
    handleInput,
    focus: () => terminal?.focus(),
  }), [
    handleInput,
    terminal,
  ])

  useLayoutEffect(function attachTerminal() {
    if (!terminalEl.current) return
    if (!terminal) return

    terminal.loadAddon(new WebLinksAddon())

    const fitAddon = new FitAddon()
    terminal.loadAddon(fitAddon)

    terminal.open(terminalEl.current)
    fitAddon.fit()

    setIsLoading(false)

    if (autofocus) terminal.focus()

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
      {title &&
        <>
          <Header
            filepath={title}
          />
          <Separator
            variant={Separator.variant.CodeEditor}
            dir={Separator.dir.Horizontal}
          />
        </>
      }
      <div
        className={`flex flex-1 min-w-0 bg-gray-300 dark:bg-black-650 pl-4 ${title ? 'rounded-b pt-2' : 'rounded pt-4'}`}
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
              className={`flex flex-1 justify-center items-center max-h-full min-w-0 ${title ? '' : 'pb-2'}`}
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
