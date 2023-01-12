import clsx from 'clsx'
import { MouseEvent, ReactNode } from 'react'

export interface Props {
  text: string
  className?: string
  size?: Size
  icon?: ReactNode
  onClick?: (e: MouseEvent<HTMLElement, globalThis.MouseEvent>) => any
}

export enum Size {
  S1,
  S2,
  S3,
}

const Sizes = {
  [Size.S1]: 'text-3xl space-x-2',
  [Size.S2]: 'text-sm space-x-1.5',
  [Size.S3]: 'text-xs space-x-1',
}

function Text({ className, text, size = Size.S2, icon, onClick }: Props) {
  const classes = clsx(
    'flex',
    'flex-row',
    'items-center',
    'text-left',
    Sizes[size],
    className,
  )

  if (icon) {
    return (
      <div
        className={classes}
        onClick={onClick}
      >
        {icon}
        <span>{text}</span>
      </div>
    )
  }

  return (
    <span
      className={classes}
      onClick={onClick}
    >
      {text}
    </span>
  )
}

Text.size = Size

export default Text
