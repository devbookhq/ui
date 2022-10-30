import clsx from 'clsx'
import { UIProp, UIPropType } from 'core'
import { observer } from 'mobx-react-lite'

import Input from 'components/Input'
import Select from 'components/Select'
import Textarea from 'components/Textarea'
import Toggle from 'components/Toggle'
import Text from 'components/typography/Text'

export interface Props<T> {
  setProp: (value: any) => any
  blockProp: any
  setupProp: UIProp<T>
}

function Prop<T>({ blockProp, setupProp, setProp }: Props<T>) {
  return (
    <div
      className={clsx('flex', {
        // Rended the props in a ROW
        'flex-1 flex-row items-center justify-between space-x-1':
          (setupProp.type === UIPropType.String && setupProp.values) ||
          setupProp.type === UIPropType.Boolean,
        // Render the prop in a COL
        'flex-col items-start space-y-1': !(
          (setupProp.type === UIPropType.String && setupProp.values) ||
          setupProp.type === UIPropType.Boolean
        ),
      })}
    >
      <Text
        className="mr-12 flex w-12 whitespace-nowrap text-slate-400"
        size={Text.size.S3}
        text={setupProp.label}
      />
      {setupProp.type === UIPropType.String && !setupProp.values && (
        <Textarea
          value={blockProp}
          onChange={e => setProp(e.target.value)}
        />
      )}
      {setupProp.type === UIPropType.String && setupProp.values && (
        <Select
          items={setupProp.values.map(p => ({
            value: p.value as string,
            label: p.label || (p.value as string),
          }))}
          selectedItemLabel={(() => {
            const item = setupProp.values.find(v => v.value === blockProp)
            return item?.label || (item?.value as string)
          })()}
          onSelect={i => setProp(i?.value)}
        />
      )}
      {setupProp.type === UIPropType.Number && (
        <Input
          value={blockProp || ''}
          onChange={e => setProp(Number(e.target.value))}
        />
      )}
      {setupProp.type === UIPropType.Boolean && (
        <Toggle
          enabled={!!blockProp}
          onChange={e => setProp(e)}
        />
      )}
    </div>
  )
}

export default observer(Prop)
