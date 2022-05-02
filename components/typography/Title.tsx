import { ReactNode } from 'react'
import cn from 'classnames'

interface Props {
  children: ReactNode
  className?: string
  variant?: Variant
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
  variant = Variant.T1,
}: Props) {
  return (
    <span className={cn(
      Variants[variant],
      className,
    )}>
      {children}
    </span>
  )
}

Title.variant = Variant

export default Title
