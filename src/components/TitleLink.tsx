import clsx from 'clsx'
import Link from 'next/link'
import { ReactNode } from 'react'
import { UrlObject } from 'url'

import Text, { Size } from 'components/typography/Text'

export interface Props {
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
      passHref
    >
      <a className={clsx('hover:no-underline', wrapperClassName)}>
        <Text
          icon={icon}
          size={size}
          text={title}
          className={clsx(
            'whitespace-nowrap',
            'transition-all',
            active ? 'text-amber-800' : 'text-slate-400 hover:text-amber-800',
            className,
          )}
        />
      </a>
    </Link>
  )
}

TitleLink.size = Size

export default TitleLink
