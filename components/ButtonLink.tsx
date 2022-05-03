import React from 'react'
import Link from 'next/link'

import Text from 'components/typography/Text'


export enum Variant {
  Full,
  Outline,
}

interface Props {
  text: string
  href: string
  variant: Variant
}

function ButtonLink({
  text,
  href,
  variant = Variant.Outline,
}: Props) {

  if (variant === Variant.Full) {
    return (
      <Link
        href={href}
      >
        <button
          className="
            py-1
            px-3

            flex
            items-center
            justify-center

            rounded-lg

            bg-green-500
          "
        >
          <Text text={text}/>
        </button>
      </Link>
    )
  }

  return (
    <Link
      href={href}
    >
      <button
        className="
          p-[2px]
          rounded-lg
          bg-black-500
          hover:bg-green-gradient
          hover:shadow-lg
          hover:shadow-green-500/50
        "
      >
        <div className="
          py-[4px]
          px-[10px]
          rounded-lg
          bg-black-900
        ">
          <Text text={text}/>
        </div>
      </button>
    </Link>
  )
}

ButtonLink.variant = Variant
export default ButtonLink
