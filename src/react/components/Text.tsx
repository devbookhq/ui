import cn from 'classnames'

export enum Hierarchy {
  Primary,
  Secondary,
  Error,
}

export enum Size {
  Small,
  Regular,
  Medium,
}

export interface Props {
  mono?: boolean
  hierarchy?: Hierarchy
  size?: Size
  hoverable?: boolean
  text?: string
}

function Text({
  mono = false,
  hierarchy = Hierarchy.Primary,
  size = Size.Regular,
  hoverable,
  text,
}: Props) {
  let colorClass: string
  let hoverColorClass = ''

  let darkColorClass: string
  let darkHoverColorClass = ''

  let sizeClass: string

  let weightClass: string

  switch (hierarchy) {
    case Hierarchy.Primary:
      colorClass = 'text-denim-700'
      darkColorClass = 'dark:text-gray-200'
      break
    case Hierarchy.Secondary:
      colorClass = 'text-denim-400'
      darkColorClass = 'dark:text-gray-700'
      if (hoverable) {
        hoverColorClass = 'hover:text-denim-700 group-hover:text-denim-700'
        darkHoverColorClass = 'dark:hover:text-gray-200 dark:group-hover:text-gray-200'
      }
      break
    case Hierarchy.Error:
      colorClass = darkColorClass = 'text-red-400'
  }

  switch (size) {
    case Size.Small:
      sizeClass = 'text-2xs'
      weightClass = 'font-400'
      break
    case Size.Regular:
      sizeClass = 'text-xs'
      weightClass = 'font-400'
      break
    case Size.Medium:
      sizeClass = 'text-base'
      weightClass = 'font-500'
      break
  }

  return (
    <span
      className={cn(
        { 'font-mono': mono },
        colorClass,
        hoverColorClass,
        darkColorClass,
        darkHoverColorClass,
        sizeClass,
        weightClass,
      )}
    >
      {text}
    </span>
  )
}

Text.size = Size
Text.hierarchy = Hierarchy

export default Text
