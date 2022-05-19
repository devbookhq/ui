import { useState } from 'react'
import { Listbox } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'

const runtimes = [
  { id: 1, name: 'Node JS' },
  { id: 2, name: 'Deno' },
  { id: 3, name: 'Python' },
  { id: 4, name: 'GoLang' },
]

function Select() {
  const [selectedPerson, setSelectedPerson] = useState(runtimes[0])

  return (
    <Listbox value={selectedPerson} onChange={setSelectedPerson}>
      <div className="relative w-full mt-1">
        <Listbox.Button
          className="
            w-full
            bg-black-700
            cursor-pointer
            py-2
            pl-3
            pr-10
            text-left
            rounded-lg
            text-sm
        ">
          <span className="block truncate">{selectedPerson.name}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <SelectorIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
      </div>

      <Listbox.Options className="
        absolut
        mt-1
        max-h-60
        w-full
        overflow-auto
        rounded-md
        bg-black-700
        py-1
        text-base
      ">
        {runtimes.map((person) => (
          <Listbox.Option
            className="
              relative
              select-none
              py-2
              pl-10
              pr-4
              cursor-pointer
            "
            key={person.id}
            value={person}
            disabled={person.unavailable}
          >
            {person.name}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </Listbox>
  )
}

export default Select
