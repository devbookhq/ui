import { ChevronDown as ChevronDownIcon } from 'lucide-react'
import {
  useCallback,
  useRef,
  useState,
} from 'react'
import { useOnClickOutside } from 'usehooks-ts'
import cn from 'clsx'

import Text from 'components/typography/Text'

import SelectValue, { Value } from './SelectValue'

export interface Props {
  label: string
  values: Value[]
  selectedValue: Value
  onChange: (v: Value) => void
  // Where to align the modal
  direction: 'left' | 'right'
}

function Select({
  label,
  values,
  selectedValue,
  onChange,
  direction,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [isOpened, setIsOpened] = useState(false)

  const handleClickOutside = useCallback(() => {
    setIsOpened(false)
  }, [])

  const handleValueSelect = useCallback((val: Value) => {
    onChange(val)
    setIsOpened(false)
  }, [onChange])

  useOnClickOutside(ref, handleClickOutside)

  return (
    <div className="
      flex
      items-center
    ">
      <div
        className="
          relative
          select-none
        "
        ref={ref}
      >
        <div
          className="
            transition-all
            cursor-pointer
            rounded
            flex
            items-center
            justify-between
            space-x-2
            min-w-[70px]
          "
          onClick={() => setIsOpened(val => !val)}
        >
          <Text
            className="text-green-500 group-hover:border-green-600 font-mono"
            text={selectedValue.title}
          />
        </div>

        {/* Modal */}
        {isOpened && (
          <div className={cn(
            {
              'left-0': direction === 'left',
              'right-0': direction === 'right',
            },
            `z-[999]
            top-[28px]
            
            absolute
            p-1
            mt-1
            pr-2
            border border-green-300 hover:border-green-400
            rounded
            bg-slate-50
            space-y-2
            min-w-[150px]`
          )}>
            {/* Label */}
            <div className="
              px-1
              relative
              left-[20px]
            ">
              <Text
                className="text-green-500"
                text={label}
              />
            </div>

            <div className="
              flex
              flex-col
              space-y-1
            ">
              {values.map(val => (
                <SelectValue
                  isSelected={val.key === selectedValue.key}
                  key={val.key}
                  value={val}
                  onSelect={handleValueSelect}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Select