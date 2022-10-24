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
    <div className="relative flex flex-1 flex-col">
      <TitleLink
        active={active}
        className="px-1 py-3"
        href={href}
        size={TitleLink.size.S3}
        title={title}
        wrapperClassName="w-full justify-center flex"
        shallow
      />
      <div
        className={clsx('absolute bottom-0 -mb-px w-full border-b-2', {
          'border-transparent': !active,
          'rounded-t border-amber-400': active,
        })}
      ></div>
    </div>
  )
}

export default HeaderLink
