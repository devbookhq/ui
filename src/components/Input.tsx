import clsx from 'clsx'
import { ChangeEvent, forwardRef } from 'react'
import { KeyboardEvent } from 'react'

export interface Props {
  wrapperClassName?: string // Only present if `title` is set.
  className?: string
  title?: string
  value?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => any
  placeholder?: string
  onEnterDown?: () => any
}

export interface Handler {
  focus: () => any
}

const InputEl = forwardRef<HTMLInputElement, Props>(
  ({ className, onEnterDown, ...rest }, ref) => {
    function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
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
          'transition-colors',
          'border-slate-200',
          'bg-white',
          'outline-none',
          'focus:border-amber-400',
          'text-xs',
          'placeholder:text-slate-300',
          className,
        )}
        onKeyDown={handleKeyDown}
      />
    )
  },
)

InputEl.displayName = 'InputEl'

const Input = forwardRef<HTMLInputElement, Props>(
  ({ title, wrapperClassName, className, value = '', ...rest }, ref) => {
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
              text-xs
            text-slate-400
          "
            >
              {title}
            </span>
            <InputEl
              className={clsx('w-full', className)}
              ref={ref}
              value={value}
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
