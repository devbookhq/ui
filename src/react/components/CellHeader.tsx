import { ReactNode } from 'react'
import cn from 'classnames'

export interface Props {
  children?: ReactNode
}

function CellHeader({
  children,
}: Props) {
  return (
    <div
      className={cn(
        'px-1.5',
        'py-1',
        'flex',
        'items-center',
        'justify-end',
        { 'justify-between': children },
        { 'space-x-2': children },

        'rounded-t',

        'bg-gray-300',
        'dark:bg-black-650',
      )}
    >
      <div
        className="
          flex
          flex-1
          items-center
          justify-start
          space-x-2
        "
      >
        {children}
      </div>
    </div>
  )
}

export default CellHeader
