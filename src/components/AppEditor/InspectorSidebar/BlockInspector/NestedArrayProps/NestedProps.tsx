import { UIComponentProps, UIProps } from 'core'
import { Trash2 } from 'lucide-react'
import { observer } from 'mobx-react-lite'

import Text from 'components/typography/Text'

import { BlockProps } from 'core/EditorProvider/models/board'

import Prop from '../Prop'

export interface Props {
  setProps: (name: string, value: any) => any
  deleteItem: () => any
  blockProps: BlockProps
  setupProps: UIProps<UIComponentProps>
  label: string
}

function NestedProps({ setProps, setupProps, blockProps, deleteItem, label }: Props) {
  return (
    // eslint-disable-next-line tailwindcss/no-custom-classname
    <div className="group/prop flex flex-1 flex-col space-y-2 rounded border border-slate-100 px-2 py-3 hover:border-slate-200 hover:shadow-sm">
      <div className="flex justify-between">
        <Text
          text={label}
          className="text-slate-400 group-hover/prop:text-slate-600"
          size={Text.size.S3}
        ></Text>
        <div
          className="cursor-pointer text-slate-300 hover:text-amber-800"
          onClick={deleteItem}
        >
          <Trash2 size="14px" />
        </div>
      </div>
      <div className="flex flex-1 flex-col space-y-4">
        {Object.entries(setupProps).map(([name, prop]) => (
          <Prop
            key={name}
            setProp={val => setProps(name, val)}
            blockProp={blockProps[name]}
            setupProp={prop}
          />
        ))}
      </div>
    </div>
  )
}

export default observer(NestedProps)
