import {
  useRef,
  useEffect,
  useState,
} from 'react'
import type { useDevbook } from '@devbookhq/sdk'
import { FitAddon } from 'xterm-addon-fit'

import 'xterm/css/xterm.css'

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
  const terminal = useTerminal({ devbook })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(function attachTerminal() {
    if (!terminalEl.current) return
    if (!terminal) return

    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);

    terminal.open(terminalEl.current)
    fitAddon.fit()

    setIsLoading(false)

    return () => {
      setIsLoading(true)
    }
  }, [terminal])

  return (
    <div className={`rounded flex flex-col flex-1 ${lightTheme ? '' : 'dark'}`}>
      <Header
        filepath="Terminal"
      />
      <div
        className="rounded-b overflow-auto min-w-0 max-h-full flex flex-1 bg-gray-300 dark:bg-black-650"
        style={{
          ...height && { height },
        }}
      >
        {/* {isLoading &&
          <div
            className="flex flex-1 justify-center items-center"
          >
            <SpinnerIcon />
          </div>
        } */}
        <div
          className="flex flex-1 min-w-0 max-h-full"
          ref={terminalEl}
        />
      </div>
    </div>
  )
}

export default Terminal
