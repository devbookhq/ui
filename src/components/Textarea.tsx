import clsx from 'clsx'

export interface Props {
  value: string
  className?: string
  placeholder?: string
  onChange: (e: any) => void
}

function Textarea({ value, className, placeholder, onChange }: Props) {
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
        'outline-none',
        'text-sm',
        'placeholder:text-slate-300',
        className,
      )}
      onChange={onChange}
    />
  )
}

export default Textarea
