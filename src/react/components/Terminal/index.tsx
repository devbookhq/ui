import {
  useRef,
  useEffect,
  useState,
} from 'react'
import type { useDevbook } from '@devbookhq/sdk'
import { FitAddon } from 'xterm-addon-fit'
import debounce from 'lodash/debounce'

import Header from '../Editor/Header'
import Separator from '../Separator'
import useTerminal from './useTerminal'
import SpinnerIcon from '../SpinnerIcon'

export interface Props {
  devbook: Pick<ReturnType<typeof useDevbook>, 'terminal' | 'status'>
  height?: string
  lightTheme?: boolean
}

function Terminal({
  devbook,
  height,
  lightTheme,
}: Props) {
  const terminalEl = useRef<HTMLDivElement>(null)
  const terminal = useTerminal({ devbook, lightTheme })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(function attachTerminal() {
    if (!terminalEl.current) return
    if (!terminal) return

    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);

    terminal.open(terminalEl.current)
    fitAddon.fit()

    const debouncedFit = debounce(() => fitAddon.fit(), 50)

    setIsLoading(false)

    terminalEl.current.addEventListener('resize', debouncedFit)

    return () => {
      terminalEl.current?.removeEventListener('resize', debouncedFit)
      setIsLoading(true)
    }
  }, [terminal])

  return (
    <div
      className={`rounded flex flex-col flex-1 ${lightTheme ? '' : 'dark'}`}
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
}

export default Terminal
