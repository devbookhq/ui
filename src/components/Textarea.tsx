import cn from 'clsx'

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
      className={cn(
        'w-full',
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
      onChange={onChange}
    />
  )
}

export default Textarea
