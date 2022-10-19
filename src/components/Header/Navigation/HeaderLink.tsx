import clsx from 'clsx'
import { UrlObject } from 'url'

import TitleLink from 'components/TitleLink'

export interface Props {
  active: boolean
  title: string
  href: UrlObject | string
}

function HeaderLink({ active, title, href }: Props) {
  return (
    <TitleLink
      active={active}
      href={href}
      size={TitleLink.size.T3}
      title={title}
      wrapperClassName="w-full justify-center flex"
      className={clsx(
        'px-1',
        'py-3',
        'border-b-2',
        {
          'border-transparent': !active,
        },
        {
          'border-lime-200': active,
        },
      )}
      shallow
    />
  )
}

export default HeaderLink
