import cn from 'classnames'
import { useMemo } from 'react'
import randomColor from 'randomcolor'

export interface Props {
  color?: string
  userDisplayName?: string
  onMouseDown?: () => void
  size?: Size
}

export enum Size {
  Small,
  Large,
}

function UserIndicator({
  onMouseDown,
  size = Size.Small,
  color,
  userDisplayName = '?',
}: Props) {

  const backgroundColor = useMemo(() => {
    if (color) return color
    return randomColor({
      luminosity: 'dark',
      seed: userDisplayName,
    })
  }, [
    color,
    userDisplayName,
  ])

  return (
    <div
      onMouseDown={onMouseDown}
      className={cn(
        'border-white-900',
        'border-2',
        'hover:border-green-500',
        'hover:shadow-lg',
        'hover:shadow-green-500/50',
        'rounded-full justify-center items-center flex',
        { 'cursor-pointer': !!onMouseDown },
        { 'w-6 h-6 text-sm': size === Size.Small },
        { 'w-8 h-8 text-base': size === Size.Large },
      )}
      style={{ backgroundColor }}
    >
      <div className="relative select-none text-white-900">
        {userDisplayName[0].toUpperCase()}
      </div>
    </div>
  )
}

UserIndicator.size = Size

export default UserIndicator
