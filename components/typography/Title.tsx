import cn from 'classnames'

interface Props {
  title: string
  className?: string
  size?: Size
  rank?: Rank
  icon?: any
}

export enum Rank {
  Primary,
  Secondary,
}

const Ranks = {
  [Rank.Primary]: 'text-white-900',
  [Rank.Secondary]: 'text-gray-600',
}

export enum Size {
  T1,
  T2,
  T3,
}

const Sizes = {
  [Size.T1]: 'text-lg font-semibold',
  [Size.T2]: 'text-base font-semibold',
  [Size.T3]: 'text-sm font-medium',
}

function Title({
  className,
  title,
  rank,
  size = Size.T1,
  icon,
}: Props) {
  const classes = cn(
    'flex',
    'flex-row',
    'items-center',
    'space-x-2',
    'text-left',
    rank !== undefined ? Ranks[rank] : undefined,
    Sizes[size],
    className,
  )

  if (icon) {
    return (
      <div className={classes}>
        {icon}
        <span>{title}</span>
      </div>
    )
  }

  return (
    <span className={classes}>
      {title}
    </span>
  )
}

Title.rank = Rank
Title.size = Size

export default Title
