import { ReactNode } from 'react'
import cn from 'classnames'

export enum Size {
  lg,
  sm,
  xs,
}

const Sizes = {
  [Size.lg]: 'text-lg',
  [Size.sm]: 'text-sm',
  [Size.xs]: 'text-xs',

}

enum Typeface {
  Normal,
  Bold,
  MonoRegular,
  MonoBold,
}

const Typefaces = {
  [Typeface.Normal]: 'font-normal',
  [Typeface.Bold]: 'font-bold',
  [Typeface.MonoRegular]: 'font-mono',
  [Typeface.MonoBold]: 'font-mono font-bold',
}

interface Props {
  className?: string
  text: string | ReactNode
  size?: Size | null
  onClick?: (e: any) => void
  typeface?: Typeface
  hoverTypeface?: Typeface
  color?: string
  hoverColor?: string
}

function Text({
  className,
  text,
  onClick,
  size = Size.sm,
  typeface = Typeface.Normal,
  hoverTypeface,
  color = 'text-gray-800 dark:text-gray-100',
  hoverColor,
}: Props) {
  return (
    <span
      className={cn(
        size && Sizes[size],
        Typefaces[typeface],
        color,
        hoverColor,
        hoverTypeface && Typefaces[hoverTypeface],
        className
      )}
      onClick={onClick}
    >
      {text}
    </span>
  )
}

Text.size = Size
Text.typeface = Typeface
export default Text
