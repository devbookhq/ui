import {
  ReactNode,
  MouseEvent,
} from 'react'

export interface Props {
  onMouseDown: (e: MouseEvent) => void
  onClick: (e: MouseEvent) => void
  icon: ReactNode
}

function ContextButton({
  onMouseDown,
  onClick,
  icon,
}: Props) {
  return (
    <button
      type="button"
      className="
        text-denim-400
        hover:text-denim-700
        dark:text-gray-700
        dark:hover:text-gray-200
        cursor-pointer
        bg-transparent
        flex
        flex-1
      "
      onMouseDown={onMouseDown}
      onClick={onClick}
    >{icon}
    </button>
  )
}

export default ContextButton
