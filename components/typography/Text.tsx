import cn from 'classnames'

export enum Size {
  S1,
  S2,
}

const Sizes = {
  [Size.S1]: 'text-sm',
  [Size.S2]: 'text-xs',
}

interface Props {
  className?: string
  text: string
  size?: Size
  onClick?: (e: any) => void
  mono?: boolean
}

function Text({
  className,
  text,
  size = Size.S2,
  onClick,
  mono,
}: Props) {
  return (
    <span
      className={cn(
        'text-white',
        Sizes[size],
        className,
        {'font-mono': mono},
      )}
      onClick={onClick}
    >
      {text}
    </span>
  )
}

Text.size = Size
export default Text
