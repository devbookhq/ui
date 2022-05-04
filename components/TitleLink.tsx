import { ReactNode } from 'react'
import Link from 'next/link'

import Title, { Size } from 'components/typography/Title'

interface Props {
  href: string
  title: string
  icon?: ReactNode
  size?: Size
}

function TitleLink({
  href,
  title,
  icon,
  size,
}: Props) {
  return (
    <Link
      href={href}
    >
      <a className="
        flex
        flex-row
        items-center
        justify-center
        space-x-2

        hover:no-underline
      ">
        {icon}
        <Title
          size={size}
          title={title}
          className="
            text-gray-600
            hover:text-white-900
          "
        />
      </a>
    </Link>
  )
}

TitleLink.size = Size
export default TitleLink
