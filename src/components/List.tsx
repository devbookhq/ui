import { Listbox, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { Fragment } from 'react'

export interface Option {
  key: string
  value: string
}

export interface Props {
  selected: Option
  onSelect: (o: Option) => void
  options: Option[]
}

function List({ selected, onSelect, options }: Props) {
  return (
    <Listbox
      value={selected}
      onChange={onSelect}
    >
      <div className="relative mt-1">
        <Listbox.Button className="focus-visible:ring-white relative w-full cursor-pointer rounded-lg border border-gray-600 py-1.5 pl-3 pr-10 text-left shadow-md hover:border-white-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
          <span className="w-30 block truncate">{selected.value}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronDownIcon
              aria-hidden="true"
              className="h-5 w-5 text-white-900"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute bottom-full z-50 mb-1 flex max-h-60 flex-col rounded-md bg-black-900 py-1 text-base shadow-lg ring-1 ring-gray-400 ring-opacity-5 focus:outline-none sm:text-sm">
            {options.map((o, idx) => (
              <Listbox.Option
                key={idx}
                value={o}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-8 ${
                    active ? 'bg-green-500 text-white-900' : 'text-white-900'
                  }`
                }
              >
                {({ selected }) => <span className="flex">{o.value}</span>}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  )
}

export default List
