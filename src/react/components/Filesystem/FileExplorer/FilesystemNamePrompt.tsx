import {
  useLayoutEffect,
  useState,
  useRef,
  ChangeEvent,
  KeyboardEvent,
} from 'react'

import Input from '../../Input'

export interface Props {
  onConfirm?: (name: string) => void,
  onBlur?: () => void,
}

function FilesystemNamePrompt({
  onConfirm,
  onBlur,
}: Props) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useLayoutEffect(function focusOnMount() {
    inputRef.current?.focus()
  }, [])

  function handleValueChange(e: ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value)
  }

  function handleInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    switch (e.code) {
      case 'Escape':
        onBlur?.()
        e.preventDefault()
        break
      case 'Enter':
        onConfirm?.(value)
        e.preventDefault()
        break
      default:
        break
    }
  }

  return (
    <Input
      className={`
        w-full
        px-1
        py-px
        outline-none
        text-xs
        rounded
        border
        text-denim-700
        dark:text-gray-200
        border-green-400
        bg-transparent
      `}
      ref={inputRef}
      value={value}
      onChange={handleValueChange}
      onBlur={onBlur}
      onKeyDown={handleInputKeyDown}
    />
  )
}

export default FilesystemNamePrompt
