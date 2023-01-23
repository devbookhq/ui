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
      style={{ borderColor: backgroundColor }}
      className={clsx(
        'flex items-center justify-center relative rounded-full border group',
        'h-6 w-6 text-sm',
        { 'cursor-pointer': !!onClick },
      )}
      onClick={onClick}
    >
      <div className="invisible transition-all group-hover:visible opacity-5 absolute w-full h-full rounded-full" style={{ backgroundColor }} />
      <div className="relative select-none" style={{
        color: backgroundColor,
      }}>
        {username[0].toUpperCase()}
      </div>
    </div>
  )
}

export default UserPortrait
