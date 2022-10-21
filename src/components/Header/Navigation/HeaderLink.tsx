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
    <div className="relative flex flex-col">
      <TitleLink
        active={active}
        href={href}
        size={TitleLink.size.T2}
        title={title}
        wrapperClassName="w-full justify-center flex"
        className={clsx('px-1', 'py-3', 'transition-all', 'hover:text-amber-800', {
          'text-slate-400': !active,
          'text-amber-800': active,
        })}
        shallow
      />
      <div
        className={clsx('absolute bottom-0 -mb-px w-full border-b-2', {
          'border-transparent': !active,
          'rounded border-amber-400': active,
        })}
      ></div>
    </div>
  )
}

export default HeaderLink
