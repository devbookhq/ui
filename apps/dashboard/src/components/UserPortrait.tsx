import clsx from 'clsx'
import randomColor from 'randomcolor'
import { MouseEvent, useMemo } from 'react'

export interface Props {
  username?: string
  onClick?: (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => any
}

function UserPortrait({ onClick, username = '?' }: Props) {
  const backgroundColor = useMemo(
    () => randomColor({ luminosity: 'bright', seed: username }),
    [username],
  )

  return (
    <div
      style={{ backgroundColor }}
      className={clsx(
        'flex items-center justify-center rounded-full',
        { 'cursor-pointer': !!onClick },
        'h-8 w-8 text-base',
      )}
      onClick={onClick}
    >
      <div className="relative select-none text-slate-50">
        {username[0].toUpperCase()}
      </div>
    </div>
  )
}

export default UserPortrait
