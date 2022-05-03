import { ReactNode } from 'react'
import cn from 'classnames'

interface Props {
  children: ReactNode
  className?: string
  variant: Variant
  rank: Rank
}

export enum Rank {
  Primary,
  Secondary,
}

const Ranks = {
  [Rank.Primary]: 'text-white-900',
  [Rank.Secondary]: 'text-black-600'
}

export enum Variant {
  T1,
  T2,
}

const Variants = {
  [Variant.T1]: 'text-2xl font-semibold',
  [Variant.T2]: 'text-base font-semibold',
}

function Title({
  className,
  children,
  rank = Rank.Primary,
  variant = Variant.T1,
}: Props) {
  return (
    <span className={cn(
      Ranks[rank],
      Variants[variant],
      className,
    )}>
      {children}
    </span>
  )
}

Title.rank = Rank
Title.variant = Variant

export default Title
