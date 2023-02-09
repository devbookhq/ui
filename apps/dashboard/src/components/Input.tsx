import clsx from 'clsx'
import { useEffect, useRef } from 'react'

export interface Props {
  value: string
  onChange: (value: string) => void
}

function Input({ value, onChange }: Props) {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(
    function autofocus() {
      if (!ref.current?.value) {
        ref.current?.focus()
      }
    }, [])

  return (
    <input
      autoCapitalize="off"
      autoComplete="email"
      autoCorrect="off"
      name="email"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="Email"
      ref={ref}
      type="email"
      className={clsx(
        'w-full',
        'px-2',
        'py-1',
        'rounded',
        'border',
        'border-slate-200',
        'outline-none',
        'focus:border-green-800',
        'text-sm',
        'placeholder:text-slate-300',
      )}
      required
    />
  )
}

export default Input
