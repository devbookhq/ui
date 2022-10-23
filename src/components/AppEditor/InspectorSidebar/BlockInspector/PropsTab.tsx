import clsx from 'clsx'
import { UIComponentProps, UIPropType, UIProps } from 'core'
import { observer } from 'mobx-react-lite'
import { Instance } from 'mobx-state-tree'

import Input from 'components/Input'
import Select from 'components/Select'
import Textarea from 'components/Textarea'
import Toggle from 'components/Toggle'
import Text from 'components/typography/Text'

import { BlockProps, boardBlock } from 'core/EditorProvider/models/board'

export interface Props {
  block: Instance<typeof boardBlock>
  blockProps: BlockProps
  setupProps: UIProps<UIComponentProps>
}

function PropsTab({ block, setupProps, blockProps }: Props) {
  return (
    <div className="flex flex-1 flex-col space-y-2 px-1">
      {Object.entries(setupProps).map(([name, prop]) => (
        <div
          key={name}
          className={clsx('flex', {
            // Rended the props in a ROW
            'flex-1 flex-row items-center justify-between space-x-1':
              (prop.type === UIPropType.String && prop.values) ||
              prop.type === UIPropType.Boolean,
            // Render the prop in a COL
            'flex-col items-start space-y-1': !(
              (prop.type === UIPropType.String && prop.values) ||
              prop.type === UIPropType.Boolean
            ),
          })}
        >
          <Text
            className="mr-12 flex w-12 whitespace-nowrap text-slate-400"
            size={Text.size.T2}
            text={prop.label}
          />
          {prop.type === UIPropType.String && !prop.values && (
            <Textarea
              value={blockProps[name]}
              onChange={e => block.setProp(name, e.target.value)}
            />
          )}
          {prop.type === UIPropType.String && prop.values && (
            <Select
              selectedItemLabel={blockProps[name]}
              items={prop.values.map(p => ({
                value: p,
                label: p,
              }))}
              onSelect={i => block.setProp(name, i?.value)}
            />
          )}
          {prop.type === UIPropType.Number && (
            <Input
              value={blockProps[name]}
              onChange={e => block.setProp(name, Number(e.target.value))}
            />
          )}
          {prop.type === UIPropType.Boolean && (
            <Toggle
              enabled={!!blockProps[name]}
              onChange={e => block.setProp(name, e)}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default observer(PropsTab)
