import React, {
  ReactNode,

} from 'react'

export interface Props {
  children: ReactNode
}

function Columns({
  children,
}: Props) {
  const [first, ...rest] = React.Children.toArray(children)
  const c = [
    <div key='first' className="w-7/12">{first}</div>,
    <div key='rest' className="w-5/12">{rest}</div>
  ]

  return (
    <div
      className="flex flex-1"
    >
      {c}
    </div>
  )
}

export default Columns
