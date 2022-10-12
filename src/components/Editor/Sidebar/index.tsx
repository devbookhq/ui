import SwitchMode from 'components/SwitchMode'

import { uiComponentsList } from '../uiComponents'

function Sidebar() {
  return (
    <div className="flex-col items-center space-y-4 border-l border-black-700 px-2 py-4">
      <SwitchMode />
      <div className="flex flex-col items-center space-y-2">
        {uiComponentsList.map(ui => (
          <ui.Sidebar key={ui.id} />
        ))}
      </div>
    </div>
  )
}

export default Sidebar
