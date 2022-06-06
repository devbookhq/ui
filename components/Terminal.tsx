import {
  useRef,
  useLayoutEffect,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from 'react'
import type {
  TerminalManager,
} from '@devbookhq/sdk'

import useTerminal from 'utils/useTerminal'
import useSession from 'utils/useSession'
import Spinner from './icons/Spinner'

export interface Props {
  terminalManager?: TerminalManager
  height?: string
  autofocus?: boolean
  onStart?: (handler: Handler) => (Promise<void> | void)
}

export interface Handler {
  handleInput: (input: string) => void
  focus: () => void
}

const Terminal = forwardRef<Handler, Props>(({
  terminalManager,
  height,
  onStart,
  autofocus,
}, ref) => {
  const terminalEl = useRef<HTMLDivElement>(null)
  const { terminal, terminalSession } = useTerminal({ terminalManager })
  const [isLoading, setIsLoading] = useState(true)

  const handleInput = useCallback((input: string) => terminalSession?.sendData(input), [terminalSession])

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
      className="rounded flex flex-col min-w-0 flex-1 dark"
    >
      <div
        className="flex flex-1 min-w-0 bg-black-650 pl-4 rounded pt-4"
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
              className="flex flex-1 justify-center items-center max-h-full min-w-0 pb-2"
            >
              <Spinner />
            </div>
          }
        </div>
      </div>
    </div>
  )
})

Terminal.displayName = 'Terminal'

export default Terminal
