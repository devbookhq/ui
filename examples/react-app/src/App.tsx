import './App.css';

import { ControlCenter, centerControls } from '@devbookhq/ui'
import Examples from './Examples';
import { Env } from '@devbookhq/sdk';

function App() {
  return (
    <div className="app">
      <button onClick={() => centerControls.openFile?.('/tsconfig.json')}>OPEN</button>
      <ControlCenter env={Env.NextJS} />
      <Examples theme='dark' />
      <Examples theme='light' />
    </div>
  );
}

export default App;
