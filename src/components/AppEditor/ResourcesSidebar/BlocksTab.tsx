import { UI, uiComponentsSetup } from '../uiComponents'

function BlocksTab() {
  return (
    <div className="flex flex-1 flex-wrap">
      {Object.keys(uiComponentsSetup).map(c => (
        <UI.SidebarIcon
          className="p-1"
          componentType={c}
          key={c}
        />
      ))}
    </div>
  )
}

export default BlocksTab
