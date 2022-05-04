import cn from 'classnames'

interface Props {
  title: string
  className?: string
  size?: Size
  rank?: Rank
}

export enum Rank {
  Primary,
  Secondary,
}

const Ranks = {
  [Rank.Primary]: 'text-white-900',
  [Rank.Secondary]: 'text-gray-600'
}

export enum Size {
  T1,
  T2,
  T3,
}

const Sizes = {
  [Size.T1]: 'text-2xl font-semibold',
  [Size.T2]: 'text-base font-semibold',
  [Size.T3]: 'text-base font-medium',
}

function Title({
  className,
  title,
  rank,
  size = Size.T1,
}: Props) {
  return (
    <span className={cn(
      rank && Ranks[rank],
      Sizes[size],
      className,
    )}>
      {title}
    </span>
  )
}

Title.rank = Rank
Title.size = Size

export default Title
