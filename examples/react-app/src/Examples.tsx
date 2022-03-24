import { DevbookStatus, useDevbook } from '@devbookhq/sdk';
import {
  Output,
  Editor,
  Iframe,
  Language,
  Filesystem,
  Terminal,
  TerminalHandler,
} from '@devbookhq/ui'
import {
  useEffect,
  useRef,
} from 'react';

function Examples({ theme }: { theme: 'dark' | 'light' }) {
  const devbook = useDevbook({
    env: 'your-vm-id',
    debug: true,
    __debug__idleTime: 3000,
    config: {
      domain: 'shared.usedevbook.com',
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
      <Terminal
        autofocus
        onStart={(handler) => {
          handler.handleInput('echo Started\n')
        }}
        ref={terminalRef}
        lightTheme={theme === 'light'}
        devbook={devbook}
        height="500px"
      />
      <Filesystem
        devbook={devbook}
        lightTheme={theme === 'light'}
      />
      <Editor
        isReadonly={false}
        lightTheme={theme === 'light'}
        language={Language.jsx}
        filepath="index.js"
        height="200px"
        initialContent={'console.log("world")'}
      />
      <Iframe
        lightTheme={theme === 'light'}
        url="https://www.openstreetmap.org/export/embed.html?bbox=-0.004017949104309083%2C51.47612752641776%2C0.00030577182769775396%2C51.478569861898606&layer=mapnik"
      />
      <Output
        lightTheme={theme === 'light'}
        stdout={['out1', 'out2']}
        stderr={['err1']}
      />
    </div>
  );
}

export default Examples;
