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
      className="flex flex-1 justify-start items-stretch"
    >
      <div key='first' className="w-7/12 justify-center p-4 flex items-stretch">
        <div className="prose prose-slate">
          {first}
        </div>
      </div>
      <div key='rest' className="w-5/12 flex">
        {rest}
      </div>
    </div>
  )
}

export default Columns
