import { SidebarIcon, uiComponentsSetup } from '../uiComponents'

function Blocks() {
  return (
    <div className="flex flex-row items-center space-x-2 px-2 py-4">
      {Object.keys(uiComponentsSetup).map(c => (
        <SidebarIcon
          componentType={c}
          key={c}
        />
      ))}
    </div>
  )
}

export default Blocks
