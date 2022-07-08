import cn from 'classnames'
import {
  ChangeEvent,
  forwardRef,
  useRef,
  useImperativeHandle,
} from 'react'

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

const InputEl = forwardRef<HTMLInputElement, Props>(({ className, onEnterDown, ...rest }, ref) => {
  function handleKeyDown(e: any) {
    if (e.key === 'Enter') onEnterDown?.()
  }

  return (
    <input
      {...rest}
      ref={ref}
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
})

InputEl.displayName = 'InputEl'

const Input = forwardRef<HTMLInputElement, Props>(({ title, wrapperClassName, className, ...rest }, ref) => {
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
              ref={ref}
              className={cn(
                'w-full',
                className,
              )}
              {...rest}
            />
          </div>
        )
        : (
          <InputEl {...rest} ref={ref} />
        )}
    </>
  )
})

Input.displayName = 'Input'

export default Input
