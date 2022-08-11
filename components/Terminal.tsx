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
import { useResizeDetector } from 'react-resize-detector'

import Text from './typography/Text'
import useTerminal from 'utils/useTerminal'
import Spinner from './icons/Spinner'
import type { FitAddon } from 'xterm-addon-fit'

export interface Props {
  terminalManager?: TerminalManager
  height?: string
  autofocus?: boolean
  onStart?: (handler: Handler) => (Promise<void> | void)
}

export interface Handler {
  handleInput: (input: string) => void
  focus: () => void
  resize: () => void
}

const Terminal = forwardRef<Handler, Props>(({
  terminalManager,
  height,
  onStart,
  autofocus,
}, ref) => {
  const terminalEl = useRef<HTMLDivElement>(null)
  const {
    terminal,
    terminalSession,
    error: errMessage,
    isLoading,
  } = useTerminal({ terminalManager })
  const [fitAddon, setFitAddon] = useState<FitAddon>()

  const onResize = useCallback(() => {
    if (!fitAddon) return

    const dim = fitAddon.proposeDimensions()

    if (!dim) return
      console.log('before')
    if (isNaN(dim.cols) || isNaN(dim.rows)) return
      console.log('after')

    fitAddon.fit()
  }, [fitAddon])

  const { ref: sizeRef } = useResizeDetector({
    refreshMode: 'debounce',
    skipOnMount: true,
    refreshRate: 110,
    onResize,
  })

  const handleInput = useCallback((input: string) => terminalSession?.sendData(input), [terminalSession])

  const focus = useCallback(() => {
    terminal?.focus()
  }, [
    terminal,
  ])

  useImperativeHandle(ref, () => ({
    handleInput,
    focus,
    resize: onResize,
  }), [
    handleInput,
    focus,
    onResize,
  ])

  useLayoutEffect(function attachTerminal() {
    (async function () {
      if (!terminalEl.current) return
      if (!terminal) return

      const fit = await import('xterm-addon-fit')
      const webLinks = await import('xterm-addon-web-links')

      terminal.loadAddon(new webLinks.WebLinksAddon())

      const fitAddon = new fit.FitAddon()
      terminal.loadAddon(fitAddon)

      terminal.open(terminalEl.current)
      fitAddon.fit()

      setFitAddon(fitAddon)

      if (autofocus) terminal.focus()
    })()
  }, [
    terminal,
    autofocus,
  ])

  useEffect(function handleOnStart() {
    if (!onStart) return
    if (!focus) return
    if (!handleInput) return

    onStart({
      handleInput,
      focus,
      resize: onResize,
    })
  }, [
    onStart,
    focus,
    handleInput,
    onResize,
  ])

  return (
    <div
      className="rounded flex flex-col min-w-0 flex-1 dark w-full"
    >
      <div
        className="flex flex-1 min-w-0 bg-black-800 border border-black-700 pl-2 rounded-lg pt-2"
        style={{
          ...height && { minHeight: height, maxHeight: height },
        }}
        ref={sizeRef}
      >
        <div
          className="flex flex-1 min-w-0"
          ref={terminalEl}
        >
          {isLoading && !errMessage &&
            <div
              className="flex flex-1 justify-center items-center max-h-full min-w-0 pb-2"
            >
              <Spinner />
            </div>
          }
          {!!errMessage &&
            <div
              className="flex flex-1 justify-center items-center max-h-full min-w-0 pb-2 px-4"
            >
              <Text
                text={errMessage}
                size={Text.size.S2}
                className="text-red-400"
              />
            </div>
          }
        </div>
      </div>
    </div>
  )
})

Terminal.displayName = 'Terminal'

export default Terminal
