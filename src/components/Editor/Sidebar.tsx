import SwitchMode from 'components/SwitchMode'

import { SidebarIcon, uiComponentsSetup } from './uiComponents'

function Sidebar() {
  return (
    <div className="flex-col items-center space-y-4 border-l border-black-700 px-2 py-4">
      <SwitchMode />
      <div className="flex flex-col items-center space-y-2">
        {Object.keys(uiComponentsSetup).map(c => (
          <SidebarIcon
            componentType={c}
            key={c}
          />
        ))}
      </div>
    </div>
  )
}

export default Sidebar
