import { ReactNode } from 'react'
import cn from 'classnames'
import Link from 'next/link'
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
  shallow,
}: Props) {
  return (
    <Link
      href={href}
      shallow={shallow}
    >
      <a
        className={cn(
          'hover:no-underline',
          wrapperClassName,
        )}
      >
        <Title
          rank={active ? Title.rank.Primary : Title.rank.Secondary}
          className={cn(
            'hover:text-white-900',
            'whitespace-nowrap',
            'transition-colors',
            className,
          )}
          size={size}
          title={title}
          icon={icon}
        />
      </a>
    </Link>
  )
}

TitleLink.size = Size
export default TitleLink
