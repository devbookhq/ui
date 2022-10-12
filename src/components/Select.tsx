import { Listbox } from '@headlessui/react'
import { SelectorIcon } from '@heroicons/react/solid'
import cn from 'clsx'

import Text from 'components/typography/Text'

interface Item {
  value: string
  name: string
}

interface Props {
  wrapperClassName?: string // Only present if `title` is set.
  title?: string
  items: Item[]
  value: Item
  onChange: (i: Item) => void
}

function SelectEl({ items, value, onChange }: Props) {
  return (
    <Listbox
      value={value}
      onChange={onChange}
    >
      {({ open }) => (
        <div
          className={cn('relative', 'w-full', 'rounded-lg', 'p-[1px]', 'bg-black-700', {
            'bg-green-gradient': open,
          })}
        >
          <Listbox.Button
            className="
              w-full
              cursor-pointer
              rounded-lg
              bg-black-900
              py-2
              pl-3
              pr-10
              text-left
              text-sm
          "
          >
            <Text
              className="block truncate"
              size={Text.size.S1}
              text={value.name}
            />
            <span
              className="
              pointer-events-none
              absolute
              inset-y-0
              right-0
              flex
              items-center
              pr-2
            "
            >
              <SelectorIcon
                aria-hidden="true"
                className="h-5 w-5 text-gray-400"
              />
            </span>
          </Listbox.Button>

          <Listbox.Options
            className="
            absolute
            z-50
            mt-1
            max-h-60
            w-full
            overflow-auto
            rounded-lg
            border
            border-black-700
            bg-black-900
            py-1
          "
          >
            {items.map(item => (
              <Listbox.Option
                disabled={false}
                key={item.value}
                value={item}
                className="
                  relative
                  cursor-pointer
                  select-none
                  py-2
                  pl-3
                  pr-4
                  text-left
                  hover:bg-black-700
                "
              >
                <Text
                  className="block truncate"
                  size={Text.size.S1}
                  text={item.name}
                />
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      )}
    </Listbox>
  )
}

function Select({ wrapperClassName, title, items, value, onChange }: Props) {
  return (
    <>
      {title ? (
        <div
          className={cn('flex', 'flex-col', 'items-start', 'space-y-1', wrapperClassName)}
        >
          <span
            className="
            font-sm
            text-gray-600
          "
          >
            {title}
          </span>
          <SelectEl
            items={items}
            value={value}
            onChange={onChange}
          />
        </div>
      ) : (
        <SelectEl
          items={items}
          value={value}
          onChange={onChange}
        />
      )}
    </>
  )
}

export default Select
