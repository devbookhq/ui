import { UI, uiComponentsSetup } from '../uiComponents'

function Blocks() {
  return (
    <div className="flex flex-row items-center space-x-2 border-b border-slate-200 p-2">
      {Object.keys(uiComponentsSetup).map(c => (
        <UI.SidebarIcon
          componentType={c}
          key={c}
        />
      ))}
    </div>
  )
}

export default Blocks
