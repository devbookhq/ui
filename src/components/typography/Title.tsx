import clsx from 'clsx'

interface Props {
  title: string
  className?: string
  size?: Size
  rank?: Rank
  icon?: any
}

export enum Rank {
  Primary,
  PrimaryAlternative,
  Secondary,
}

const Ranks = {
  [Rank.Primary]: 'text-gray-600',
  [Rank.PrimaryAlternative]: 'text-yellow-200',
  [Rank.Secondary]: 'text-gray-400',
}

export enum Size {
  T0,
  T1,
  T2,
  T3,
}

const Sizes = {
  [Size.T0]: 'text-2xl',
  [Size.T1]: 'text-base',
  [Size.T2]: 'text-sm',
  [Size.T3]: 'text-sm',
}

function Title({ className, title, rank, size = Size.T1, icon }: Props) {
  const classes = clsx(
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

  return <span className={classes}>{title}</span>
}

Title.rank = Rank
Title.size = Size

export default Title
