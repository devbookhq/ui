import {
  useRef,
  useEffect,
} from 'react'
import type { useDevbook } from '@devbookhq/sdk'

import Header from '../Editor/Header'
import Separator from '../Separator'
import useTerminal from './useTerminal'

export interface Props {
  devbook: ReturnType<typeof useDevbook>
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
      <Separator
        variant={Separator.variant.CodeEditor}
        dir={Separator.dir.Horizontal}
      />
      <div
        className="flex-1 flex max-h-full min-w-0 overflow-auto rounded"
        ref={terminalEl}
        style={{
          ...height && { height },
        }}
      />
    </div>
  )
}

export default Terminal
