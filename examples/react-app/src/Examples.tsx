import { DevbookStatus, useDevbook } from '@devbookhq/sdk';
import {
  Output,
  Editor,
  Iframe,
  Language,
  Filesystem,
  Terminal,
  Screen,
  TerminalHandler,
} from '@devbookhq/ui'
import {
  useEffect,
  useRef,
} from 'react';

function Examples({ theme }: { theme: 'dark' | 'light' }) {
  const devbook = useDevbook({
    env: 'dbk-dev-env',
    __debug__idleTime: 9999999,
    debug: true,
    config: {
      domain: 'dev.usedevbook.com',
    },
  })

  const terminalRef = useRef<TerminalHandler>(null)

  function runEcho() {
    if (devbook.status !== DevbookStatus.Connected) return
    if (!terminalRef.current) return

    terminalRef.current.handleInput('echo Hello\n')
    terminalRef.current.focus()
  }

  return (
    <div className="space-y-2 w-[750px]">
      <Screen devbook={devbook}></Screen>
    </div>
  );
}

export default Examples;
