import {
  File as FileIcon,
  Pin as PinIcon,
  X as XIcon,
} from 'lucide-react'
import clsx from 'clsx'

// import { analytics } from 'utils/analytics'
import Text from '../../components/typography/Text'

export interface Props {
  text: string
  isSelected?: boolean
  isFirst?: boolean
  isLast?: boolean
  displayCloseButton?: boolean
  onClick?: () => void
  onCloseClick?: (e: any) => void
}

function FileButton({
  text,
  isSelected,
  isFirst,
  isLast,
  onClick,
  displayCloseButton = true,
  onCloseClick,
}: Props) {

  function handleCloseClick(e: any) {
    e.stopPropagation()
    onCloseClick?.(e)
  }

  function handleClick() {
    onClick?.()
    // analytics.track('editor file tab selected', { file: text })
  }

  return (
    <button
      className={clsx(
        'mr-4',
        'lg:mr-0',
        'px-1',
        'py-0.5',
        'border',
        'border-b-0',
        { 'border-l-0': (isLast && !isFirst) || (!isLast && !isFirst) },
        'border-gray-300',
        'justify-center',
        { 'rounded-tl-md': isFirst },
        { 'rounded-tr-md': isLast },
        { 'hover:bg-white': !isSelected },
        { 'bg-gray-100': !isSelected },
        { 'bg-transparent': isSelected },
        'group',
      )}
      onClick={handleClick}
    >
      <div
        className="
          flex
          items-center
          space-x-1
        "
      >
        <FileIcon
          className={clsx(
            { 'text-gray-800': isSelected },
            { 'text-gray-500': !isSelected },
            { 'group-hover:text-gray-700': !isSelected },
            'transition-all',
            'duration-75',
          )}
          size={12}
        />
        <Text
          className={clsx(
            'transition-all duration-75',
            { 'text-gray-800': isSelected },
            { 'text-gray-500': !isSelected },
          )}
          // hoverColor={`${!isSelected ? 'group-hover:text-gray-700' : ''}`}
          size={Text.size.S3}
          text={text}
        />
        {displayCloseButton ? (
          <XIcon
            className={clsx(
              { 'text-gray-600': isSelected },
              { 'text-gray-500': !isSelected },
              { 'group-hover:text-gray-600': !isSelected },
              'transition-all',
              'duration-75',
              'p-0.5',
              'rounded-full',
              'hover:bg-gray-200',
            )}
            size={14}
            onClick={handleCloseClick}
          />
        ) : (
          <PinIcon
            className={clsx(
              { 'text-gray-600': isSelected },
              { 'text-gray-500': !isSelected },
              { 'group-hover:text-gray-600': !isSelected },
              'transition-all',
              'duration-75',
              'rounded-full',
            )}
            size={14}
          />
        )}
      </div>
    </button>
  )
}

export default FileButton
