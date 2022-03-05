import {
  useRef,
  useEffect,
} from 'react'
import type { useDevbook } from '@devbookhq/sdk'

import 'xterm/css/xterm.css'

import Header from '../Editor/Header'
import Separator from '../Separator'
import useTerminal from './useTerminal'

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

  useEffect(function attachTerminal() {
    if (!terminalEl.current) return

    terminal?.open(terminalEl.current)
  }, [terminal])

  return (
    <div className={`rounded ${lightTheme ? '' : 'dark'}`}>
      <Header
        filepath="Terminal"
      />
      <div
        className="flex-1 flex max-h-full min-w-0 overflow-auto"
        ref={terminalEl}
        style={{
          ...height && { height },
        }}
      />
    </div>
  )
}

export default Terminal
