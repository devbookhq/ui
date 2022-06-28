import cn from 'classnames'
import { ChangeEvent, HTMLInputTypeAttribute } from 'react'

interface Props {
  wrapperClassName?: string // Only present if `title` is set.
  className?: string
  title?: string
  value?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  onEnterDown?: () => void
  type?: HTMLInputTypeAttribute
  autoFocus?: boolean
  autoComplete?: string
}

function InputEl({ className, onEnterDown, ...rest }: Props) {
  function handleKeyDown(e: any) {
    if (e.key === 'Enter') onEnterDown?.()
  }

  return (
    <input
      {...rest}
      onKeyDown={handleKeyDown}
      className={cn(
        'px-2.5',
        'py-2',
        'rounded-lg',
        'border',
        'border-black-700',
        'bg-black-900',
        'outline-none',
        'focus:border-green-200',
        'text-sm',
        'font-semibold',
        'placeholder:text-gray-600',
        className,
      )}
    />
  )
}

function Input({ title, wrapperClassName, className, ...rest }: Props) {
  return (
    <>
      {title
        ? (
          <div className={cn(
            'flex',
            'flex-col',
            'items-start',
            'space-y-1',
            wrapperClassName,
          )}>
            <span className="
            font-sm
            text-gray-600
          ">
              {title}
            </span>
            <InputEl
              className={cn(
                'w-full',
                className,
              )}
              {...rest}
            />
          </div>
        )
        : (
          <InputEl {...rest} />
        )}
    </>
  )
}

export default Input
