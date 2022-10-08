import { useRouter } from 'next/router'
import { ReactNode } from 'react'

import Button, { Variant } from 'components/Button'

interface Props {
  text: string
  href: string
  variant?: Variant
  icon?: ReactNode
}

function ButtonLink({ text, href, variant = Variant.Outline, icon }: Props) {
  const router = useRouter()
  return (
    <Button
      icon={icon}
      variant={variant}
      text={text}
      onClick={() => router.push(href)}
    />
  )
}

ButtonLink.variant = Variant
export default ButtonLink
