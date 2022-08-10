import cn from 'classnames'
import TitleLink from 'components//TitleLink'
import { UrlObject } from 'url'

export interface Props {
  active: boolean
  title: string
  href: UrlObject | string
}

function SidebarLink({
  active,
  title,
  href,
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
        'font-bold',
        'border-l-2',
        {'border-transparent': !active},
        {'hover:text-green-500': active},
        {'border-green-500': active},
        {'text-green-500': active},
        {'bg-white-900/5': active},
      )}
      href={href}
      active={active}
      title={title}
      size={TitleLink.size.T3}
      shallow
    />
  )
}

export default SidebarLink
