import { identity } from 'utils/identity'
import { sortByOrder } from 'utils/sortByOrder'

import { UI, componentsSetup } from '../uiComponents'

// Use this array to arrange the order of blocks in the sidebar
const blocksOrder = ['Editor', 'Terminal', 'Text', 'Logo']
const blocks = Object.keys(componentsSetup).sort(sortByOrder(blocksOrder, identity))

function BlocksTab() {
  return (
    <div className="flex flex-1 flex-wrap">
      {blocks.map(c => (
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
