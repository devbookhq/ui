import {
  ReactNode,
} from 'react'
import cn from 'classnames'

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
  isDisabled
}: Props) {
  if (variant === Variant.Full) {
    return (
      <button
        type={type}
        className={cn(
          'py-1.5',
          'px-2',

          'flex',
          'items-center',
          'justify-center',

          'rounded-lg',
          'bg-green-500',
          'hover:shadow-lg',
          { 'hover:shadow-green-500/50': !isDisabled },
          { 'opacity-70': isDisabled },
          { 'cursor-not-allowed': isDisabled },
          className,
        )}
        onClick={!isDisabled ? onClick : () => { }}
      >
        <div className="
          flex
          flex-row
          items-center
          justify-center
          space-x-1.5
          bg-green-500
        ">
          <Text
            size={Text.size.S2}
            text={text}
          />
        </div>
      </button>
    )
  }

  return (
    <button
      type={type}
      className={cn(
        'p-[1px]',
        'rounded-lg',
        'bg-black-700',
        'hover:bg-green-gradient',
        'hover:shadow',
        { 'hover:shadow-green-500/50': !isDisabled },
        { 'opacity-70': isDisabled },
        { 'cursor-not-allowed': isDisabled },
        className,
      )}
      onMouseDown={!isDisabled ? onClick : () => { }}
    >
      <div className="
        py-1
        px-2

        flex
        flex-row
        items-center
        justify-center
        space-x-1.5

        rounded-lg
        bg-black-900
      ">
        {icon}
        <Text
          size={Text.size.S2}
          text={text}
        />
      </div>
    </button>
  )
}

Button.variant = Variant
export default Button
