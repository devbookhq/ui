import clsx from 'clsx'
import { ReactNode } from 'react'

import Text from 'components/typography/Text'

export enum Variant {
  Full,
  Outline,
}

interface Props {
  className?: string
  text: string
  variant?: Variant
  icon?: ReactNode
  onClick?: (e: any) => void
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
          'rounded',
          'bg-lime-200 hover:bg-lime-300',
          {
            'drop-shadow-sm': !isDisabled,
          },
          {
            'opacity-70': isDisabled,
          },
          {
            'cursor-not-allowed': isDisabled,
          },
          className,
        )}
        onClick={!isDisabled ? onClick : () => {}}
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
            size={Text.size.S1}
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
        'bg-white hover:bg-gray-100',
        'border border-gray-200 hover:border-gray-300',
        {
          'shadow-sm': !isDisabled,
        },
        {
          'opacity-70': isDisabled,
        },
        {
          'cursor-not-allowed': isDisabled,
        },
        className,
      )}
      onMouseDown={!isDisabled ? onClick : () => {}}
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
          size={Text.size.S1}
          text={text}
        />
      </div>
    </button>
  )
}

Button.variant = Variant

export default Button
