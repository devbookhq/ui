import clsx from 'clsx'
import { MouseEvent } from 'react'

export interface Props {
  color: string
  userDisplayName?: string
  onClick?: (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => void
  size?: Size
}

export enum Size {
  Small,
  Large,
}

function UserIndicator({
  onClick,
  size = Size.Small,
  color,
  userDisplayName = '?',
}: Props) {
  return (
    <div
      style={{ backgroundColor: color }}
      className={clsx(
        'flex items-center justify-center rounded-full',
        { 'cursor-pointer': !!onClick },
        { 'h-6 w-6 text-sm': size === Size.Small },
        { 'h-8 w-8 text-base': size === Size.Large },
      )}
      onClick={onClick}
    >
      <div className="relative select-none text-gray-100">
        {userDisplayName[0].toUpperCase()}
      </div>
    </div>
  )
}

UserIndicator.size = Size

export default UserIndicator
