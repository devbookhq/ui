import { ReactNode } from 'react'
import cn from 'classnames'

export interface Props {
  children?: ReactNode
  rounded?: boolean
}

function CellHeader({
  children,
  rounded,
}: Props) {
  return (
    <div
      className={cn(
        'px-2',
        'py-1',
        'flex',
        'items-center',
        'justify-end',
        { 'justify-between': children },
        { 'space-x-2': children },

        { 'rounded-t': rounded },

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
