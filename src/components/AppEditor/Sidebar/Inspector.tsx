import { UIPropType } from 'core'
import { observer } from 'mobx-react-lite'

import Input from 'components/Input'
import List from 'components/List'
import Textarea from 'components/Textarea'
import Toggle from 'components/Toggle'
import Text from 'components/typography/Text'

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
    <div className="min-w-[250px] flex-col items-center justify-center space-y-2 border-l border-slate-200 py-2">
      <Text
        className="flex justify-center"
        text={uiComponentSetup.label}
      />
      <div className="flex flex-1 flex-col space-y-4 border-t border-slate-200 p-4">
        {Object.entries(uiProps).map(([name, prop]) => (
          <div
            className="flex flex-col items-start justify-start space-y-1"
            key={name}
          >
            <Text
              className="mr-12 flex w-12 whitespace-nowrap text-slate-400"
              size={Text.size.T2}
              text={prop.label}
            />
            {prop.type === UIPropType.String && !prop.values && (
              <Textarea
                value={blockProps[name]}
                onChange={e => selectedBlock.setProp(name, e.target.value)}
              />
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
              />
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
