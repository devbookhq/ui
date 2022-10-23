import clsx from 'clsx'
import { ChangeEvent } from 'react'

export interface Props {
  value: string
  className?: string
  placeholder?: string
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => any
}

function Textarea({ value = '', className, placeholder, onChange }: Props) {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      className={clsx(
        'w-full',
        'px-2.5',
        'py-2',
        'rounded',
        'border',
        'border-slate-200',
        'bg-white',
        'focus:border-amber-400',
        'outline-none',
        'transition-all',
        'text-sm',
        'placeholder:text-slate-300',
        className,
      )}
      onChange={onChange}
    />
  )
}

export default Textarea
