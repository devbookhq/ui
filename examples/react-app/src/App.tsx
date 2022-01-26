import { Output, Editor, Iframe, Language } from '@devbookhq/ui'

import './App.css'

function App() {
  return (
    <div className="app">
      <Editor
        language={Language.jsx}
        filepath="index.js"
        initialCode={'console.log("world")'}
      />
      <Iframe
        url="https://www.openstreetmap.org/export/embed.html?bbox=-0.004017949104309083%2C51.47612752641776%2C0.00030577182769775396%2C51.478569861898606&layer=mapnik"
      />
      <Output
        stdout={['out1', 'out2']}
        stderr={['err1']}
      />
    </div >
  );
}

export default App;
