import clsx from 'clsx'
import { MouseEvent, ReactNode } from 'react'

export interface Props {
  text: string
  className?: string
  size?: Size
  icon?: ReactNode
  onClick?: (e: MouseEvent<HTMLElement, globalThis.MouseEvent>) => void
}

export enum Size {
  T0,
  T1,
  T2,
}

const Sizes = {
  [Size.T0]: 'text-3xl',
  [Size.T1]: 'text-sm',
  [Size.T2]: 'text-xs',
}

function Text({ className, text, size = Size.T1, icon, onClick }: Props) {
  const classes = clsx(
    'flex',
    'flex-row',
    'items-center',
    'space-x-1.5',
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
