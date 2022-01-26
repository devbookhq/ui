import { ReactNode } from 'react'
import cn from 'classnames'

export interface Props {
  children?: ReactNode
  sideButtons?: ReactNode
  name?: string
}

function CellHeader({
  children,
  sideButtons,
  name,
}: Props) {
  return (
    <div
      className={cn(
        { 'pl-1.5': !name },
        'pr-1.5',

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
          items-center
          justify-start
          space-x-2
        "
      >
        {name && (
          <div
            className="
              py-0.5
              px-1.5
              h-full
              rounded-tl
              bg-purple-400
            "
          >
            <span
              className="
                text-gray-200
                text-2xs
                font-mono
                font-400
              "
            >
              {name}
            </span>
          </div>
        )}

        <div
          className="
            py-1
            flex
            justify-start
            items-center
            space-x-2
          "
        >
          {children}
        </div>
      </div>


      {sideButtons && (
        <div
          className="
            py-1
            flex
            items-center
            space-x-2
          "
        >
          {sideButtons}
        </div>
      )}
    </div>
  )
}

export default CellHeader
