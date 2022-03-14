import {
  MouseEvent as ReactMouseEvent,
} from 'react'
import Text from './Text'

export interface Props {
  onClick?: (event: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => void
  text: string,
  lightTheme?: boolean
}

function Button({
  onClick,
  text,
  lightTheme,
}: Props) {
  return (
    <div
      className={`${lightTheme ? '' : 'dark'}`}
    >
      <button
        className="
        py-2
        px-3
        
        flex
        items-center
        justify-center
        
        rounded
        border-none
        cursor-pointer

        text-denim-400
        dark:text-gray-200

        bg-gray-550
        dark:bg-black-600

        hover:bg-gray-600
        hover:dark:bg-black-700
        "
        onClick={onClick}
      >
        <Text
          hierarchy={Text.hierarchy.Primary}
          hoverable
          size={Text.size.Regular}
          text={text}
        />
      </button>
    </div>
  )
}

export default Button
