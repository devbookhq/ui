import './App.css';

import { CodeSnippet, SharedSessionProvider } from '@devbookhq/react'

function App() {
  return (
    <div className="App">
      <SharedSessionProvider opts={{ codeSnippetID: 'Hq0FmpRimr2k' }}>
        <div style={{ height: '200px' }}>
          <CodeSnippet id='Hq0FmpRimr2k' isEditable={true} />
        </div>
      </SharedSessionProvider>
    </div>
  );
}

export default App;
