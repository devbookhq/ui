import {
  useCallback,
  useRef,
  useState,
} from 'react'
import { useOnClickOutside } from 'usehooks-ts'
import clsx from 'clsx'
import { ChevronDown as ChevronDownIcon } from 'lucide-react'

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
          className={clsx(
            `transition-all
            cursor-pointer
            flex
            hover:border-cyan-500
            hover:text-cyan-500
            border-b-4
            items-center
            justify-between
            space-x-1
            min-w-[70px]`,
            {
              'text-cyan-500 border-cyan-500': isOpened,
              'text-cyan-200 border-cyan-200': !isOpened,
            }
          )}
          onClick={() => setIsOpened(val => !val)}
        >
          <Text
            className="font-mono"
            text={selectedValue.title}
          />
          <ChevronDownIcon
            className="self-center"
            size={14}
          />
        </div>

        {/* Modal */}
        {isOpened && (
          <div className={clsx(
            {
              'left-0': direction === 'left',
              'right-0': direction === 'right',
            },
            `z-[999]
            top-[28px]
            
            absolute
            p-1
            mt-0.5
            border border-cyan-200
            rounded
            bg-slate-50
            space-y-2
            min-w-[150px]`
          )}>
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