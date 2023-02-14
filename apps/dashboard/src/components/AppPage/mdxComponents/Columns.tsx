import React, {
  ReactNode,

} from 'react'

export interface Props {
  children: ReactNode
}

const Half = (props: any) => <div {...props} style={{
  width: '50%',
  img: {
    height: 'auto',
  }
}} />

function Columns({
  children,
}: Props) {
  const [first, ...rest] = React.Children.toArray(children)
  const c = [<Half key='first'>{first}</Half>, <Half key='rest'>{rest}</Half>]

  return (
    <div
      className="flex flex-1 items-start"
    >
      {c}
    </div>
  )
}

export default Columns
