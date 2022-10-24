import { observer } from 'mobx-react-lite'
import { Instance } from 'mobx-state-tree'

import { componentsSetup } from 'components/AppEditor/uiComponents'
import Tabs from 'components/Tabs'
import Text from 'components/typography/Text'

import { boardBlock } from 'core/EditorProvider/models/board'

import PropsTab from './PropsTab'
import StyleTab from './StyleTab'

export interface Props {
  block: Instance<typeof boardBlock>
}

function BlockInspector({ block }: Props) {
  const uiComponentSetup = componentsSetup[block.componentType]

  const setupProps = uiComponentSetup.props
  const blockProps = block.getProps()

  return (
    <div className="flex flex-col items-stretch">
      <Text
        className="self-center py-3"
        text={`${uiComponentSetup.label} config`}
      />
      <Tabs
        defaultValue="props"
        tabs={[
          {
            label: 'Props',
            value: 'props',
            component: (
              <PropsTab
                block={block}
                blockProps={blockProps}
                setupProps={setupProps}
              />
            ),
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

export default observer(BlockInspector)
