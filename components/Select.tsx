import { useState } from 'react'
import { Listbox } from '@headlessui/react'
import cn from 'classnames'

import Text from 'components/typography/Text'
import { SelectorIcon } from '@heroicons/react/solid'

const runtimes = [
  { id: 1, name: 'Node.js' },
  { id: 2, name: 'Deno' },
  { id: 3, name: 'Python' },
  { id: 4, name: 'GoLang' },
  { id: 6, name: 'JS, HTML, CSS' },
  { id: 5, name: 'Custom' },
]

interface Props {
  wrapperClassName?: string // Only present if `title` is set.
  title?: string
}

function SelectEl() {
  const [selected, setSelected] = useState(runtimes[0])
  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <div className={cn(
          'relative',
          'w-full',
          'rounded-lg',
          'p-[1px]',
          'bg-black-700',
          { 'bg-green-gradient': open },
        )}>
          <Listbox.Button
            className="
              w-full
              bg-black-900
              cursor-pointer
              py-2
              pl-3
              pr-10
              text-left
              rounded-lg
              text-sm
          ">
            <Text
              className="block truncate"
              text={selected.name}
              size={Text.size.S1}
            />
            <span className="
              pointer-events-none
              absolute
              inset-y-0
              right-0
              flex
              items-center
              pr-2
            ">
              <SelectorIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>

          <Listbox.Options className="
            absolute
            mt-1
            max-h-60
            w-full
            overflow-auto
            rounded-lg
            py-1
            bg-black-900
            border
            border-black-700
            z-50
          ">
            {runtimes.map((runtime) => (
              <Listbox.Option
                className="
                  relative
                  select-none
                  py-2
                  pl-3
                  pr-4
                  cursor-pointer
                  hover:bg-black-700
                  text-left
                "
                key={runtime.id}
                value={runtime}
                disabled={false}
              >
                <Text
                  className="block truncate"
                  size={Text.size.S1}
                  text={runtime.name}
                />
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      )}
    </Listbox>
  )
}


function Select({ wrapperClassName, title }: Props) {
  return (
    <>
      {title
      ? (
        <div className={cn(
          'flex',
          'flex-col',
          'items-start',
          'space-y-1',
          wrapperClassName,
        )}>
          <span className="
            font-sm
            text-gray-600
          ">
            {title}
          </span>
          <SelectEl/>
        </div>
      )
      : (
        <SelectEl/>
      )}
    </>
  )
}

export default Select
