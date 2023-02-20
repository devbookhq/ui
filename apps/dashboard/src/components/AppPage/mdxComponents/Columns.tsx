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
      className="
        h-full
        max-h-full
        max-w-[100vw]
        flex
        items-start
        justify-start
        bg-red-500
      "
    >
      <div
        key="first"
        className="
          self-stretch
          w-full
          max-w-[calc(100%-5/12*100vw)]
          bg-yellow-200
          max-h-full
          p-4
          overflow-auto
          prose
          prose-slate
      ">
        {first}
      </div>

      <div
        key="rest"
        className="
          self-stretch
          w-full
          max-w-[calc(100%-7/12*100vw)]
          max-h-full
          flex
          overflow-auto
      ">
        {rest}
      </div>
    </div>
  )
}

export default Columns
