import { SessionProvider, Terminal } from '@devbookhq/react'
import React from 'react'

import './App.css'

function App() {
  return (
    <div className="App">
      <SessionProvider opts={{ codeSnippetID: '9uDpF0vBywCA' }}>
        <div style={{ height: '400px', width: '300px' }}>
          {/* <CodeSnippet
            id="9uDpF0vBywCA"
            isEditable={true}
          /> */}
          <Terminal
            autofocus={true}
            isHidden={false}
            onRunningCmdChange={() => {}}
          />
        </div>
      </SessionProvider>
    </div>
  )
}

export default App
