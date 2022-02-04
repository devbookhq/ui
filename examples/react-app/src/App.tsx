import './App.css';

import { ControlCenter } from '@devbookhq/ui'
import Examples from './Examples';
import { Env } from '@devbookhq/sdk';

function App() {
  return (
    <div className="app">
      <ControlCenter env={Env.NextJS} />
      <Examples theme='dark' />
      <Examples theme='light' />
    </div>
  );
}

export default App;
