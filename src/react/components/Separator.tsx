import cn from 'classnames'

export enum Dir {
  Horizontal,
  Vertical,
}

export enum Variant {
  Default,
  CodeEditor,
  SiderNav,
}

export interface Props {
  dir: Dir
  variant: Variant,
  className?: string
}

function Separator({
  dir,
  variant,
  className,
}: Props) {
  let color: string
  let colorDark: string
  switch (variant) {
    case Variant.CodeEditor:
      color = 'border-gray-500'
      colorDark = 'dark:border-black-600'
      break
    case Variant.SiderNav:
      color = 'border-gray-600'
      colorDark = 'dark:border-black-650'
      break
    default:
      color = 'border-gray-400'
      colorDark = 'dark:border-black-650'
      break
  }

  return (
    <div
      className={cn(
        color,
        colorDark,
        { 'border-b': dir === Dir.Horizontal },
        { 'border-r': dir === Dir.Vertical },
        className,
      )}
    />
  )
}

Separator.dir = Dir
Separator.variant = Variant

export default Separator
