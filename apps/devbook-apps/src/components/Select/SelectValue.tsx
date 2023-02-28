import { Check as CheckIcon } from 'lucide-react'

import Text from 'components/typography/Text'

export interface Value {
  title: string
  key: string
}

export interface Props {
  value: Value
  onSelect: (v: Value) => void
  isSelected: boolean
}

function SelectValue({
  value,
  onSelect,
  isSelected,
}: Props) {
  return (
    <div
      className="
        py-0.5
        px-1
        rounded
        cursor-pointer
        hover:bg-gray-100
        flex
        items-center
        space-x-1.5
      "
      onClick={() => onSelect(value)}
    >
      <div className="
        w-[14px]
        h-[14px]
        flex
        items-center
        justify-center
      ">
        {isSelected &&
          <CheckIcon
            className="text-brand-500"
            size={14}
          />
        }
      </div>
      <Text
        className="whitespace-nowrap"
        text={value.title}
      />
    </div>
  )
}

export default SelectValue
