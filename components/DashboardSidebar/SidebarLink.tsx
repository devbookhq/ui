import cn from 'clsx'
import { ReactNode } from 'react'
import { UrlObject } from 'url'

import TitleLink from 'components//TitleLink'

export interface Props {
  active: boolean
  title: string
  href: UrlObject | string
  icon: ReactNode
}

function SidebarLink({ active, title, href, icon }: Props) {
  return (
    <TitleLink
      active={active}
      href={href}
      icon={icon}
      size={TitleLink.size.T3}
      title={title}
      wrapperClassName="w-full"
      className={cn(
        'w-full',
        'pl-2',
        'pr-8',
        'py-1.5',
        'hover:bg-white-900/5',
        'border-l-2',
        {
          'border-transparent': !active,
        },
        {
          'border-green-500': active,
        },
        {
          'bg-[#18161C]': active,
        },
      )}
      shallow
    />
  )
}

export default SidebarLink
