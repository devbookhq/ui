import {
  forwardRef,
  KeyboardEvent,
  ChangeEvent,
} from 'react'

export interface InputProps {
  className?: string
  value?: string
  placeholder?: string
  onMouseDown?: () => void
  disabled?: boolean
  onBlur?: (e: any) => void
  onFocus?: (e: any) => void
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  className,
  value,
  disabled,
  onChange,
  onMouseDown,
  onKeyDown,
  placeholder,
  onBlur,
  onFocus,
}, ref) => {
  return (
    <input
      onMouseDown={onMouseDown}
      onBlur={onBlur}
      onFocus={onFocus}
      placeholder={placeholder}
      onKeyDown={onKeyDown}
      disabled={disabled}
      ref={ref}
      className={className}
      value={value}
      onChange={onChange}
    />
  )
})

Input.displayName = 'Input'
export default Input
