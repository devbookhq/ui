import clsx from 'clsx'
import { MouseEvent, ReactNode } from 'react'

import Text from 'components/typography/Text'

export enum Variant {
  Full,
  Outline,
  Uncolored,
}

export interface Props {
  className?: string
  text?: string
  variant?: Variant
  icon?: ReactNode
  onClick?: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => any
  isDisabled?: boolean
  type?: 'submit'
}

function Button({
  className,
  text,
  variant = Variant.Outline,
  icon,
  onClick,
  type,
  isDisabled,
}: Props) {
  return (
    <button
      type={type}
      className={clsx(
        'flex',
        'items-center',
        'justify-center',
        'transition-all',
        'rounded',
        'border',
        'space-x-1.5',
        'py-1.5',
        'px-3',
        {
          'cursor-not-allowed opacity-70': isDisabled,
          'border-amber-200 bg-amber-200 stroke-amber-800 text-amber-800 hover:border-amber-300 hover:bg-amber-300':
            variant === Variant.Full,
          'border-slate-200 bg-white hover:border-amber-800 hover:text-amber-800':
            variant === Variant.Outline,
        },
        className,
      )}
      onClick={!isDisabled ? onClick : undefined}
    >
      {icon}
      {text && (
        <Text
          size={Text.size.S3}
          text={text}
        />
      )}
    </button>
  )
}

Button.variant = Variant

export default Button
