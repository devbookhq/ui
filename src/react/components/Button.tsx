import {
  MouseEvent as ReactMouseEvent,
} from 'react'
import { Spinner } from '..'
import Text from './Text'

export interface Props {
  onClick?: (event: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => void
  text: string,
  lightTheme?: boolean
  disabled?: boolean
  isLoading?: boolean
}

function Button({
  onClick,
  text,
  lightTheme,
  disabled,
  isLoading,
}: Props) {
  return (
    <div
      className={`${lightTheme ? '' : 'dark'}`}
    >
      <button
        className={`
        py-2
        px-3
        
        flex
        items-center
        justify-center
        whitespace-nowrap

        rounded
        border-none

        text-denim-400
        dark:text-gray-200

        bg-gray-550
        dark:bg-black-600

        ${disabled ? 'cursor-not-allowed' : 'hover:bg-gray-600 hover:dark:bg-black-700'}
        ${isLoading ? 'cursor-wait' : 'cursor-pointer'}
        `}
        onClick={onClick}
        disabled={disabled}
      >
        {(disabled || isLoading) &&
          <div className="absolute flex my-auto">
            <Spinner />
          </div>
        }
        <div className={`${disabled || isLoading ? 'invisible' : 'visible'}`}>
          <Text
            hierarchy={Text.hierarchy.Primary}
            hoverable={!disabled}
            size={Text.size.Regular}
            text={text}
          />
        </div>
      </button>
    </div>
  )
}

export default Button
