import {
  useRef,
  useLayoutEffect,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from 'react'
import type { useDevbook } from '@devbookhq/sdk'

import Header from '../Editor/Header'
import Separator from '../Separator'
import useTerminal from '../Terminal/useTerminal'
import SpinnerIcon from '../SpinnerIcon'

export interface Props {
  devbook: Pick<ReturnType<typeof useDevbook>, 'terminal' | 'status'>
  height?: string
  lightTheme?: boolean
  title?: string
  autofocus?: boolean
  onStart?: (handler: Handler) => (Promise<void> | void)
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
  const { terminal, session } = useTerminal({ devbook, lightTheme })
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
    async function attach() {
      if (!terminalEl.current) return
      if (!terminal) return

      const fit = await import('xterm-addon-fit')
      const webLinks = await import('xterm-addon-web-links')

      terminal.loadAddon(new webLinks.WebLinksAddon())

      const fitAddon = new fit.FitAddon()
      terminal.loadAddon(fitAddon)

      terminal.open(terminalEl.current)
      fitAddon.fit()

      setIsLoading(false)

      if (autofocus) terminal.focus()

      return () => {
        setIsLoading(true)
      }
    }

    const res = attach()

    return () => {
      res.then(r => r?.())
    }
  }, [
    terminal,
    autofocus,
  ])

  useEffect(function handleOnStart() {
    if (!onStart) return
    if (!terminal) return
    if (!handleInput) return

    onStart({
      handleInput,
      focus: () => terminal.focus(),
    })
  }, [
    onStart,
    terminal,
    handleInput,
  ])

  return (
    <div
      className={`flex px-2 pt-2 flex-col max-h-[180px] sm:max-h-[240px] md:max-h-[300px] min-w-0 bg-black-650 flex-1 ${lightTheme ? '' : 'dark'}`}
    >
      <div
        className={`flex flex-1 min-w-0 bg-gray-300 dark:bg-black-650`}
      >
        <div
          className="flex flex-1 min-w-0 max-h-full"
          ref={terminalEl}
        >
          {isLoading &&
            <div
              className={`flex flex-1 justify-center items-center max-h-full min-w-0`}
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
