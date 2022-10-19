import { UIPropType } from 'core'
import { observer } from 'mobx-react-lite'

import Input from 'components/Input'
import List from 'components/List'
import Textarea from 'components/Textarea'
import Toggle from 'components/Toggle'
import Title from 'components/typography/Title'

import { useRootStore } from 'core/BuilderProvider/models/RootStoreProvider'

import { uiComponentsSetup } from '../uiComponents'

function Inspector() {
  const { board } = useRootStore()

  const selectedBlock = board.selectedBlock

  if (!selectedBlock) return null

  const uiComponentSetup = uiComponentsSetup[selectedBlock.componentType]

  if (!uiComponentSetup) return null

  const uiProps = uiComponentSetup.props
  const blockProps = selectedBlock.getProps()

  return (
    <div className="flex flex-col space-y-2">
      <Title
        className="flex self-center"
        rank={Title.rank.Primary}
        title={uiComponentSetup.label}
      />
      <div className="flex flex-1 flex-col space-y-4 border-t border-gray-200 p-4">
        {Object.entries(uiProps).map(([name, prop]) => (
          <div
            className="flex flex-col items-start justify-start"
            key={name}
          >
            <Title
              className="mr-12 flex w-12"
              rank={Title.rank.Secondary}
              size={Title.size.T2}
              title={prop.label}
            />
            {prop.type === UIPropType.String && !prop.values && (
              <Textarea
                value={blockProps[name]}
                onChange={e => selectedBlock.setProp(name, e.target.value)}
              ></Textarea>
            )}
            {prop.type === UIPropType.String && prop.values && (
              <List
                options={prop.values.map(p => ({ key: p, value: p }))}
                selected={{ key: blockProps[name], value: blockProps[name] }}
                onSelect={e => selectedBlock.setProp(name, e.value)}
              />
            )}
            {prop.type === UIPropType.Number && (
              <Input
                value={blockProps[name]}
                onChange={e => selectedBlock.setProp(name, Number(e.target.value))}
              ></Input>
            )}
            {prop.type === UIPropType.Boolean && (
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
