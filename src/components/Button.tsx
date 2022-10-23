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
  text: string
  variant?: Variant
  icon?: ReactNode
  onClick?: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void
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
  if (variant === Variant.Full) {
    return (
      <button
        type={type}
        className={clsx(
          'py-1.5',
          'px-3',
          'flex',
          'items-center',
          'justify-center',
          'transition-all',
          'rounded',
          'stroke-amber-800 text-amber-800',
          'bg-amber-200 hover:bg-amber-300',
          {
            'opacity-70': isDisabled,
          },
          {
            'cursor-not-allowed': isDisabled,
          },
          className,
        )}
        onClick={!isDisabled ? onClick : undefined}
      >
        <div
          className="
          flex
          flex-row
          items-center
          justify-center
          space-x-1.5
        "
        >
          {icon}
          <Text
            size={Text.size.T2}
            text={text}
          />
        </div>
      </button>
    )
  }

  return (
    <button
      type={type}
      className={clsx(
        'rounded',
        'transition-all',
        'bg-white',
        'border border-slate-100 hover:border-amber-800 hover:text-amber-800',
        {
          'opacity-70': isDisabled,
        },
        {
          'cursor-not-allowed': isDisabled,
        },
        className,
      )}
      onClick={!isDisabled ? onClick : undefined}
    >
      <div
        className="
        flex
        flex-row
        items-center
        justify-center
        space-x-1.5
        py-1.5
        px-3
      "
      >
        {icon}
        <Text
          size={Text.size.T2}
          text={text}
        />
      </div>
    </button>
  )
}

Button.variant = Variant

export default Button
