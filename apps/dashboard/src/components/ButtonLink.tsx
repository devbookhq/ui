import { useRouter } from 'next/router'
import { ReactNode } from 'react'
import { UrlObject } from 'url'

import Button, { Variant } from 'components/Button'

interface Props {
  text: string
  href: UrlObject | string
  variant?: Variant
  icon?: ReactNode
  className?: string
}

function ButtonLink({ className, text, href, variant = Variant.Outline, icon }: Props) {
  const router = useRouter()
  return (
    <Button
      icon={icon}
      text={text}
      className={className}
      variant={variant}
      onClick={() => router.push(href)}
    />
  )
}

ButtonLink.variant = Variant

export default ButtonLink
