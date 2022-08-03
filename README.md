# Devbook UI
Devbook UI is a React UI library.

## Installation
```sh
npm install @devbookhq/ui
```

## Usage
Available components:
- [Editor](#editor)
- [Iframe](#iframe)
- [Output](#output)
- [Filesystem](#filesystem)
- [Terminal](#terminal)

![example](examples/example.png)

### Editor
```tsx
import { Editor, Language } from '@devbookhq/ui'

export default function ExampleEditor() {
  return (
    <Editor
      filename="index.js"
      language={Language.js}
      initialContent='console.log("world")'
      onContentChange={(content) => console.log(content)}
      isReadonly={false}
      lightTheme={true}
    />
  )
}
```

Supported languages:
* JS/JSX
* TS/TSX
* Shell
* SQL
* Python

### Iframe
```tsx
import { Iframe } from '@devbookhq/ui'

export default function ExampleIframe() {
  return (
    <Iframe
      url="https://..."
      lightTheme={false}
      height="150px"
    />
  )
}
```

### Output
```tsx
import { Output } from '@devbookhq/ui'

export default function ExampleOutput() {
  return (
    <Output
      stdout={['out1', 'out2']}
      stderr={['err1']}
      lightTheme={false}
      height="150px"
    />
  )
}
```

### Filesystem
```tsx
import { Filesystem } from '@devbookhq/ui'
import { useDevbook } from '@devbookhq/sdk'

export default function ExampleFilesystem() {
  const devbook = useDevbook({ env: 'your-vm-id', config: { domain: 'shared.usedevbook.com' }})

  return (
    <Filesystem
      devbook={devbook}
      lightTheme={false}
      height="150px"
      initialFilepath="/README.md"
    />
  )
}
```

### Terminal
```tsx
import { Terminal, TerminalHandle } from '@devbookhq/ui'
import { useDevbook } from '@devbookhq/sdk'

export default function ExampleTerminal() {
  const devbook = useDevbook({ env: 'your-vm-id', config: { domain: 'shared.usedevbook.com' }})

  const terminalRef = useRef<TerminalHandle>(null)

  function runEcho() {
    if (devbook.status !== DevbookStatus.Connected) return
    if (!terminalRef.current) return

    // You can programatically control the terminal like this
    terminalRef.current.handleInput('echo Hello\n')
    terminalRef.current.focus()
  }

  return (
    <Terminal
      // This method is run after the terminal connects to the VM
      onStart={(handler) => {
        handler.handleInput('echo Started\n')
      }}
      ref={terminalRef}
      onStart={}
      devbook={devbook}
      lightTheme={false}
      height="200px"
    />
  )
}
```


## Example projects
* [React example](examples/react-app)
