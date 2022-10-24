import Tabs from 'components/Tabs'
import Text from 'components/typography/Text'

import EnvTab from './EnvTab'
import LayoutTab from './LayoutTab'
import StyleTab from './StyleTab'

function AppInspector() {
  return (
    <div className="flex flex-1 flex-col items-stretch">
      <Text
        className="self-center py-3"
        text="App config"
      />
      <Tabs
        defaultValue="layout"
        tabs={[
          {
            label: 'Layout',
            value: 'layout',
            component: <LayoutTab />,
          },
          {
            label: 'Style',
            value: 'style',
            component: <StyleTab />,
          },
          {
            label: 'Environemnt',
            value: 'env',
            component: <EnvTab />,
          },
        ]}
      />
    </div>
  )
}

export default AppInspector
