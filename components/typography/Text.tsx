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
  text: string
  size?: Size
}

function Text({
  text,
  size = Size.S2,
}: Props) {
  return (
    <span className={cn(
      'text-white',
      Sizes[size],
    )}>
      {text}
    </span>
  )
}

Text.size = Size
export default Text
