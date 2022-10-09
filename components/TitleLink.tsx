import cn from 'clsx'
import Link from 'next/link'
import { ReactNode } from 'react'
import { UrlObject } from 'url'

import Title, { Size } from 'components/typography/Title'

interface Props {
  className?: string
  wrapperClassName?: string
  href: UrlObject | string
  title: string
  icon?: ReactNode
  size?: Size
  active?: boolean
  alternative?: boolean
  shallow?: boolean
}

function TitleLink({
  className,
  wrapperClassName,
  href,
  title,
  icon,
  size,
  active,
  alternative,
  shallow,
}: Props) {
  return (
    <Link
      href={href}
      shallow={shallow}
    >
      <a className={cn('hover:no-underline', wrapperClassName)}>
        <Title
          // Ugh..
          icon={icon}
          size={size}
          title={title}
          className={cn(
            'hover:text-white-900',
            'whitespace-nowrap',
            'transition-colors',
            className,
          )}
          rank={
            active
              ? alternative
                ? Title.rank.PrimaryAlternative
                : Title.rank.Primary
              : Title.rank.Secondary
          }
        />
      </a>
    </Link>
  )
}

TitleLink.size = Size
export default TitleLink
