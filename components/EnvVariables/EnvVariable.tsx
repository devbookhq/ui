import React, {
  ChangeEvent,
  useState,
  forwardRef,
} from 'react'

import Input, { Handler as InputHandler } from 'components/Input'
import Title from 'components/typography/Title'
import CancelIcon from 'components/icons/Cancel'
import Button from 'components/Button'

export interface Props {
  varKey?: string
  varValue?: string
  onVarKeyChange?: (key: string) => void
  onDelete?: () => void
  onAdd?: (key: string, value?: string) => void
  onVarValueChange?: (value: string) => void
}

const EnvVariable = forwardRef<HTMLInputElement, Props>(({
  varKey = '',
  varValue = '',
  onVarKeyChange,
  onDelete,
  onAdd,
  onVarValueChange,
}, ref) => {
  const [key, setKey] = useState(varKey)
  const [value, setValue] = useState(varValue)

  function handleKeyChange(e: ChangeEvent<HTMLInputElement>) {
    const newKey = e.target.value
    onVarKeyChange?.(newKey)
    setKey(newKey)
  }

  function handleValueChange(e: ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value
    onVarValueChange?.(newValue)
    setValue(newValue)
  }

  return (
    <div
      className="
        w-full
        flex
        flex-1
        items-center
      "
    >
      <div
        className="flex space-x-2 pr-4"
      >
        <Title
          className="text-gray-500"
          title="Name"
          size={Title.size.T3}
        />
        <Input
          ref={ref}
          value={key}
          onChange={handleKeyChange}
        />
      </div>
      <div
        className="flex space-x-2 pr-2"
      >
        <Title
          className="text-gray-500"
          title="Value"
          size={Title.size.T3}
        />
        <Input
          value={value}
          onChange={handleValueChange}
        />
      </div>
      {!!onDelete &&
        <div
          onClick={onDelete}
          className="text-black-700 cursor-pointer hover:text-red-400"
        >
          <CancelIcon
          />
        </div>
      }
      {!!onAdd &&
        <Button
          text="Add"
          isDisabled={!key}
          onClick={() => {
            if (key) {
              onAdd(key, value)
              setKey('')
              setValue('')
            }
          }}
        />
      }
    </div>
  )
})

EnvVariable.displayName = 'EnvVariable'

export default EnvVariable
