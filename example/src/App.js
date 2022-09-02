import './App.css';

import { CodeSnippet, SharedSessionProvider } from '@devbookhq/react'

function App() {
  return (
    <div className="App">
      <SharedSessionProvider opts={{ codeSnippetID: 'a5HSDvbAI44c' }}>
        <div style={{ height: '200px', width: '300px' }}>
          <CodeSnippet id='a5HSDvbAI44c' isEditable={true} />
          <CodeSnippet id='a5HSDvbAI44c' />
        </div>
      </SharedSessionProvider>
    </div>
  );
}

export default App;
