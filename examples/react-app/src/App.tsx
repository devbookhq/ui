import './App.css';

import { ControlCenter } from '@devbookhq/ui'
import Examples from './Examples';

function App() {
  return (
    <div className="app">
      <ControlCenter />
      <Examples theme='dark' />
      <Examples theme='light' />
    </div>
  );
}

export default App;
