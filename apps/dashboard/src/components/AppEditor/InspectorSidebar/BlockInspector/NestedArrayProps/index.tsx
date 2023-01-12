import { UIComponentProps, UIProps } from 'core'
import { PlusCircle } from 'lucide-react'
import { observer } from 'mobx-react-lite'

import Text from 'components/typography/Text'

import { BlockProps } from 'core/EditorProvider/models/board'

import NestedProps from './NestedProps'

export interface Props {
  setArrayProps: (idx: number, name: string, value: any) => any
  addItem: () => any
  label: string
  nestedLabel: string
  deleteItem: (idx: number) => any
  blockArrayProps: BlockProps[]
  setupProps: UIProps<UIComponentProps>
}

function NestedArrayProps({
  setArrayProps,
  setupProps,
  addItem,
  label,
  nestedLabel,
  deleteItem,
  blockArrayProps,
}: Props) {
  return (
    <div className="flex flex-1 flex-col space-y-2">
      <div className="flex flex-1 items-center justify-between">
        <Text
          text={label}
          className="text-slate-400"
        />
        <div
          className="cursor-pointer text-slate-300 hover:text-amber-400"
          onClick={addItem}
        >
          <PlusCircle size="16px" />
        </div>
      </div>
      {blockArrayProps.map((blockProps, i) => (
        <NestedProps
          key={i}
          label={`${nestedLabel} ${i + 1}`}
          deleteItem={() => deleteItem(i)}
          blockProps={blockProps}
          setProps={(name, value) => setArrayProps(i, name, value)}
          setupProps={setupProps}
        />
      ))}
    </div>
  )
}

export default observer(NestedArrayProps)
