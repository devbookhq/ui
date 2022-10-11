import { CodeEditor, SessionProvider, Terminal, withCasing } from '@devbookhq/react'
import React from 'react'

import './App.css'

const C = withCasing(CodeEditor)
const T = withCasing(Terminal)

function App() {
  return (
    <div className="App">
      <SessionProvider opts={{ codeSnippetID: '9uDpF0vBywCA' }}>
        <div style={{ width: '200px', height: '300px' }}>
          {/* <CodeSnippet
            id="9uDpF0vBywCA"
            isEditable={true}
          /> */}
          <T
            autofocus={true}
            isHidden={false}
            onRunningCmdChange={() => {}}
          />
          {/* <C
            content="dddddddddddddddddddddddddddddddddddddddddddddd"
            language="Nodejs"
          /> */}
        </div>
      </SessionProvider>
    </div>
  )
}

export default App
