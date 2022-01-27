import {
  MouseEvent as ReactMouseEvent,
  ReactNode,
  forwardRef,
} from 'react'

export interface Props {
  onMouseDown?: (event: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => void
  icon: ReactNode,
}

const IconButton = forwardRef<HTMLButtonElement, Props>(({
  onMouseDown,
  icon,
}, ref) => {
  return (
    <button
      ref={ref}
      className="
        py-1
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
      onMouseDown={onMouseDown}
    >
      {icon}
    </button>
  )
})

IconButton.displayName = 'IconButton'
export default IconButton
