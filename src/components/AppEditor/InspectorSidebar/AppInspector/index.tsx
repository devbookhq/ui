import Tabs from 'components/Tabs'
import Text from 'components/typography/Text'

import EnvTab from './EnvTab'
import StyleTab from './StyleTab'

function AppInspector() {
  return (
    <div className="flex flex-1 flex-col items-stretch">
      <Text
        className="self-center py-3"
        text="App config"
      />
      <Tabs
        defaultValue="env"
        tabs={[
          {
            label: 'Environemnt',
            value: 'env',
            component: <EnvTab />,
          },
          {
            label: 'Style',
            value: 'style',
            component: <StyleTab />,
          },
        ]}
      />
    </div>
  )
}

export default AppInspector
