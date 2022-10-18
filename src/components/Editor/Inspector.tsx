import { UIPropType } from 'core'
import { observer } from 'mobx-react-lite'

import Input from 'components/Input'
import List from 'components/List'
import Textarea from 'components/Textarea'
import Toggle from 'components/Toggle'
import Text from 'components/typography/Text'
import Title from 'components/typography/Title'

import { useRootStore } from 'core/BuilderProvider/models/RootStoreProvider'

import { uiComponentsSetup } from './uiComponents'

function Inspector() {
  const { board } = useRootStore()

  const selectedBlock = board.selectedBlock

  if (!selectedBlock) return null

  const uiComponentSetup = uiComponentsSetup[selectedBlock.componentType]

  if (!uiComponentSetup) return null

  const uiProps = uiComponentSetup.props
  const blockProps = selectedBlock.getProps()

  return (
    <div className="flex flex-col space-y-2 border-t border-black-700 p-2 pb-8">
      <Title
        className="py-2"
        rank={Title.rank.Primary}
        title={uiComponentSetup.label}
      />
      <div className="flex flex-1 flex-col space-y-4">
        {Object.entries(uiProps).map(([name, prop]) => (
          <div
            className="flex items-center justify-start"
            key={name}
          >
            <Text
              className="mr-12 flex w-12"
              text={prop.label}
            />
            {prop.type === UIPropType.string && !prop.values && (
              <Textarea
                value={blockProps[name]}
                onChange={e => selectedBlock.setProp(name, e.target.value)}
              ></Textarea>
            )}
            {prop.type === UIPropType.string && prop.values && (
              <List
                options={prop.values.map(p => ({ key: p, value: p }))}
                selected={{ key: blockProps[name], value: blockProps[name] }}
                onSelect={e => selectedBlock.setProp(name, e.value)}
              />
            )}
            {prop.type === UIPropType.number && (
              <Input
                value={blockProps[name]}
                onChange={e => selectedBlock.setProp(name, Number(e.target.value))}
              ></Input>
            )}
            {prop.type === UIPropType.boolean && (
              <Toggle
                enabled={!!blockProps[name]}
                onChange={e => selectedBlock.setProp(name, e)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default observer(Inspector)
