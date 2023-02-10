import clsx from 'clsx'
import { useEffect, useRef } from 'react'

import Text from 'components/typography/Text'

export interface Props {
  value?: string
  placeholder?: string
  onChange: (value: string) => void
  isTransparent?: boolean
  autofocus?: boolean
  label?: string
}

function Input({
  value,
  isTransparent,
  autofocus,
  onChange,
  placeholder,
  label,
}: Props) {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(
    function focus() {
      if (!ref.current) return
      if (autofocus) {
        ref.current.focus()
      }
    }, [autofocus])

  return (
    <div className="flex flex-col space-y-1 flex-1">
      {label && <Text text={label} size={Text.size.S3} />}
      <input
        autoCapitalize="off"
        autoCorrect="off"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        ref={ref}
        type="text"
        className={clsx(
          { 'bg-transparent': isTransparent },
          'w-full',
          'px-2',
          'focus:bg-white',
          'py-1',
          'rounded',
          'border',
          'border-slate-200',
          'hover:border-slate-300',
          'outline-none',
          'focus:border-green-800',
          'text-sm',
          'placeholder:text-slate-300',
        )}
        required
      />
    </div>
  )
}

export default Input
