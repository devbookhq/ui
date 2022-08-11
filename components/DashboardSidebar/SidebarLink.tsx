import { ReactNode } from 'react'
import cn from 'classnames'
import TitleLink from 'components//TitleLink'
import { UrlObject } from 'url'

export interface Props {
  active: boolean
  title: string
  href: UrlObject | string
  icon: ReactNode,
}

function SidebarLink({
  active,
  title,
  href,
  icon,
}: Props) {
  return (
    <TitleLink
      wrapperClassName="w-full"
      className={cn(
        'w-full',
        'pl-2',
        'pr-8',
        'py-1.5',
        'hover:bg-white-900/5',
        'border-l-2',
        {'border-transparent': !active},
        {'border-green-500': active},
        {'bg-[#18161C]': active},
      )}
      href={href}
      active={active}
      title={title}
      size={TitleLink.size.T3}
      icon={icon}
      shallow
    />
  )
}

export default SidebarLink
