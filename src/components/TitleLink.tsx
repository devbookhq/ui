import clsx from 'clsx'
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
      passHref
    >
      <a className={clsx('hover:no-underline', wrapperClassName)}>
        <Title
          icon={icon}
          size={size}
          title={title}
          className={clsx(
            { 'hover:text-gray-600': !active },
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
