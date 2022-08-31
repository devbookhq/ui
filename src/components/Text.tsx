import React, { ReactNode } from 'react'
import cn from 'classnames'

export enum Size {
  S0,
  S1,
  S2,
}

export enum Rank {
  Primary,
  Secondary,
}

const Ranks = {
  [Rank.Primary]: 'text-white-900',
  [Rank.Secondary]: 'text-gray-600 group-hover:text-white-900',
}

const Sizes = {
  [Size.S0]: 'text-base',
  [Size.S1]: 'text-sm',
  [Size.S2]: 'text-xs',
}

interface Props {
  className?: string
  text: string | ReactNode
  size?: Size
  onClick?: (e: any) => void
  mono?: boolean
  rank?: Rank
}

function Text({
  className,
  text,
  size = Size.S2,
  rank = Rank.Primary,
  onClick,
  mono,
}: Props) {
  return (
    <span
      className={cn(
        'text-white',
        Sizes[size],
        className,
        { 'font-mono': mono },
        Ranks[rank],
        'hover:text-white',
      )}
      onClick={onClick}
    >
      {text}
    </span>
  )
}

Text.rank = Rank
Text.size = Size
export default Text
