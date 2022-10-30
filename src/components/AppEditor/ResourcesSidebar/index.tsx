import Sidebar from 'components/Sidebar'
import Tabs from 'components/Tabs'

import BlocksTab from './BlocksTab'
import DatabasesTab from './DatabasesTab'

function ResourcesSidebar() {
  return (
    <Sidebar
      className="flex flex-col items-stretch"
      side={Sidebar.side.Left}
    >
      <Tabs
        defaultValue="blocks"
        tabs={[
          {
            label: 'Blocks',
            value: 'blocks',
            component: <BlocksTab />,
          },
          {
            label: 'Databases',
            value: 'databases',
            component: <DatabasesTab />,
          },
        ]}
      />
    </Sidebar>
  )
}

export default ResourcesSidebar
