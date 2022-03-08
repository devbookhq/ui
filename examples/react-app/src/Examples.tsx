import { useDevbook } from '@devbookhq/sdk';
import {
  Output,
  Editor,
  Iframe,
  Language,
  Filesystem,
  Terminal,
} from '@devbookhq/ui'

import './Examples.css'

function Examples({ theme }: { theme: 'dark' | 'light' }) {
  const devbook = useDevbook({ debug: true, env: 'dbk-dev-env', config: { domain: 'dev.usedevbook.com' } })

  return (
    <div className="examples">
      <Terminal
        lightTheme={theme === 'light'}
        devbook={devbook}
        height="200px"
      />
      <Filesystem
        devbook={devbook}
        lightTheme={theme === 'light'}
      />
      {/* <Editor
        isReadonly={false}
        lightTheme={theme === 'light'}
        language={Language.jsx}
        filepath="index.js"
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
