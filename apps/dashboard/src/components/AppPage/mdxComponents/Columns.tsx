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

  return (
    <div
      className="flex flex-1"
    >
      <div key='first' className="w-7/12 flex-1 justify-center p-8 flex">
        <div className="prose">
          {first}
        </div>
      </div>
      <div key='rest' className="w-5/12">
        {rest}
      </div>
    </div>
  )
}

export default Columns
