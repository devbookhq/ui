import { SessionProvider } from '@devbookhq/react'
import React from 'react'

import './App.css'
import Test from './Test'

function App() {
  return (
    <div className="App">
      <SessionProvider opts={{ codeSnippetID: 's8GzxcGmvrpf' }}>
        <div style={{ width: '200px', height: '300px' }}>
          <Test></Test>
        </div>
      </SessionProvider>
    </div>
  )
}

export default App
