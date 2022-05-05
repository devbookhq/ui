import { ReactNode } from 'react'
import Link from 'next/link'

import Text from 'components/typography/Text'
import Button, { Variant } from 'components/Button'

interface Props {
  text: string
  href: string
  variant?: Variant
  icon?: ReactNode
}

function ButtonLink({
  text,
  href,
  variant = Variant.Outline,
  icon,
}: Props) {
  return (
    <Link
      href={href}
    >
      <Button
        icon={icon}
        variant={variant}
        text={text}
      />
    </Link>
  )
}

ButtonLink.variant = Variant
export default ButtonLink
