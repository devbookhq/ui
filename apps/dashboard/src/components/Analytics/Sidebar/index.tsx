import Sidebar from 'components/Sidebar'
import Tabs from 'components/Tabs'

import BlocksTab from './InsightsTab'

function AnalyticsSidebar() {
  return (
    <Sidebar
      className="flex flex-col items-stretch"
      side={Sidebar.side.Left}
    >
      <Tabs
        defaultValue="blocks"
        tabs={[
          {
            label: 'Insights',
            value: 'Insights',
            component: <BlocksTab />,
          },
        ]}
      />
    </Sidebar>
  )
}

export default AnalyticsSidebar
