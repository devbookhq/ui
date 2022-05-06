import cn from 'classnames'

export enum Size {
  S1,
  S2,
}

const Sizes = {
  [Size.S1]: 'text-sm font-semibold',
  [Size.S2]: 'text-sm',
}

interface Props {
  className?: string
  text: string
  size?: Size
  onClick?: (e: any) => void
}

function Text({
  className,
  text,
  size = Size.S2,
  onClick,
}: Props) {
  return (
    <span
      className={cn(
        'text-white',
        Sizes[size],
        className,
      )}
      onClick={onClick}
    >
      {text}
    </span>
  )
}

Text.size = Size
export default Text
