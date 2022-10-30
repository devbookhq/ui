import { UIComponentProps, UIPropType, UIProps, parseDefaultProps } from 'core'
import produce from 'immer'
import { observer } from 'mobx-react-lite'

import { BlockProps } from 'core/EditorProvider/models/board'

import NestedArrayProps from './NestedArrayProps'
import Prop from './Prop'

export interface Props {
  setProps: (name: string, value: any) => any
  blockProps: BlockProps
  setupProps: UIProps<UIComponentProps>
}

function PropsTab({ setProps, setupProps, blockProps }: Props) {
  return (
    <div className="flex flex-1 flex-col space-y-4 overflow-auto px-1">
      {Object.entries(setupProps).map(([name, prop]) =>
        prop.type === UIPropType.Array && prop.nestedType ? (
          <NestedArrayProps
            key={name}
            nestedLabel={prop.nestedLabel || prop.label}
            label={prop.label}
            blockArrayProps={blockProps[name]}
            setupProps={prop.nestedType}
            addItem={() => {
              const props = blockProps[name]

              const defaultProps = Object.entries(prop.nestedType || {}).reduce(
                parseDefaultProps,
                {},
              )

              const newProps = produce(props, (draft: { [x: string]: any }[]) => {
                draft.push(defaultProps)
              })

              setProps(name, newProps)
            }}
            deleteItem={(idx: number) => {
              const props = blockProps[name]

              const newProps = produce(props, (draft: { [x: string]: any }[]) => {
                draft.splice(idx, 1)
              })

              setProps(name, newProps)
            }}
            setArrayProps={(idx: number, nestedName: string, value: any) => {
              const props = blockProps[name]

              const newProps = produce(props, (draft: { [x: string]: any }[]) => {
                draft[idx][nestedName] = value
              })

              setProps(name, newProps)
            }}
          />
        ) : (
          <Prop
            key={name}
            setProp={val => setProps(name, val)}
            blockProp={blockProps[name]}
            setupProp={prop}
          />
        ),
      )}
    </div>
  )
}

export default observer(PropsTab)
