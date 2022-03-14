import { DevbookStatus, useDevbook } from '@devbookhq/sdk';
import {
  Output,
  Editor,
  Iframe,
  Language,
  Filesystem,
  Terminal,
  Button,
  TerminalHandler,
} from '@devbookhq/ui'
import { useEffect, useRef } from 'react';

import './Examples.css'

function Examples({ theme }: { theme: 'dark' | 'light' }) {
  const devbook = useDevbook({ debug: true, env: 'dbk-dev-env', config: { domain: 'dev.usedevbook.com' } })

  const terminalRef = useRef<TerminalHandler>(null)

  useEffect(function initialize() {
    async function init() {
      console.log('term')
      if (devbook.status !== DevbookStatus.Connected) return
      if (!terminalRef.current) return
      if (!devbook.fs) return

      await devbook.fs.write('/.runops/config', '')

      terminalRef.current.executeCmd('runops tasks repl\n:target mysql-test-target\n\x0C')
    }

    init()
  }, [
    terminalRef,
    devbook.fs,
    devbook.status,
  ])

  function getUsers() {
    if (devbook.status !== DevbookStatus.Connected) return
    if (!terminalRef.current) return

    terminalRef.current.executeCmd('')
  }

  return (
    <div className="examples">
      <Terminal
        ref={terminalRef}
        lightTheme={theme === 'light'}
        devbook={devbook}
        height="500px"
      />
      <Button
        text="Get users from DB"
        onMouseDown={getUsers}
      />
      {/* <Filesystem
        devbook={devbook}
        lightTheme={theme === 'light'}
      /> */}
      {/* <Editor
        isReadonly={false}
        lightTheme={theme === 'light'}
        language={Language.jsx}
        filepath="index.js"
        height="200px"
        initialContent={'console.log("world")'}
      /> */}
      {/* <Iframe
        lightTheme={theme === 'light'}
        url="https://www.openstreetmap.org/export/embed.html?bbox=-0.004017949104309083%2C51.47612752641776%2C0.00030577182769775396%2C51.478569861898606&layer=mapnik"
      /> */}
      {/* <Output
        lightTheme={theme === 'light'}
        stdout={['out1', 'out2']}
        stderr={['err1']}
      /> */}
    </div>
  );
}

export default Examples;
