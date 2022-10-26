import clsx from 'clsx'
import { Trash } from 'lucide-react'
import { PropsWithChildren } from 'react'

import Text from 'components/typography/Text'

export interface Props {
  isSelected?: boolean
  isEnabled?: boolean
  onDelete?: () => any
  label?: string
}

function BlockOutline({
  isSelected,
  children,
  onDelete,
  label,
  isEnabled,
}: PropsWithChildren<Props>) {
  return (
    <div
      className={clsx(
        'group relative flex h-full w-full items-stretch justify-center rounded-b rounded-r border-2 transition-colors',
        {
          'z-40 border-amber-300 hover:border-amber-400': isSelected,
          'border-transparent': !isSelected,
          'rounded-tl hover:border-amber-300': isEnabled && !isSelected,
        },
      )}
    >
      <div
        className={clsx(
          'absolute -left-0.5 -top-6 z-50 flex h-5 cursor-move items-center justify-center rounded-t bg-amber-300 py-3 px-2 text-amber-800 transition-all group-hover:bg-amber-400',
          {
            'pointer-events-none hidden': !isSelected,
          },
        )}
      >
        <Text
          size={Text.size.S3}
          text={label || ''}
        />
        <div className="ml-4 flex flex-1 cursor-pointer">
          <div
            className="text-amber-700 hover:text-amber-800"
            onClick={onDelete}
          >
            <Trash size="12px" />
          </div>
        </div>
      </div>
      <div
        className={clsx('flex h-full w-full flex-1 cursor-default transition-shadow', {
          'drop-shadow-lg': isSelected,
        })}
      >
        {children}
      </div>
    </div>
  )
}

export default BlockOutline
