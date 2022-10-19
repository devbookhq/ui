import clsx from 'clsx'
import { ChangeEvent, forwardRef } from 'react'

export interface Props {
  wrapperClassName?: string // Only present if `title` is set.
  className?: string
  title?: string
  value?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  onEnterDown?: () => void
}

export interface Handler {
  focus: () => void
}

const InputEl = forwardRef<HTMLInputElement, Props>(
  ({ className, onEnterDown, ...rest }, ref) => {
    function handleKeyDown(e: any) {
      if (e.key === 'Enter') onEnterDown?.()
    }

    return (
      <input
        {...rest}
        ref={ref}
        spellCheck={false}
        className={clsx(
          'px-2.5',
          'py-1',
          'rounded',
          'border',
          'border-gray-200',
          'bg-white',
          'outline-none',
          'focus:border-gray-500/30',
          'text-sm',
          'placeholder:text-gray-300',
          className,
        )}
        onKeyDown={handleKeyDown}
      />
    )
  },
)

InputEl.displayName = 'InputEl'

const Input = forwardRef<HTMLInputElement, Props>(
  ({ title, wrapperClassName, className, ...rest }, ref) => {
    return (
      <>
        {title ? (
          <div
            className={clsx(
              'flex',
              'flex-col',
              'items-start',
              'space-y-1',
              wrapperClassName,
            )}
          >
            <span
              className="
              text-sm
            text-gray-400
          "
            >
              {title}
            </span>
            <InputEl
              className={clsx('w-full', className)}
              ref={ref}
              {...rest}
            />
          </div>
        ) : (
          <InputEl
            {...rest}
            ref={ref}
          />
        )}
      </>
    )
  },
)

Input.displayName = 'Input'

export default Input
