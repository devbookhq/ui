import * as RadixSelect from '@radix-ui/react-select'
import clsx from 'clsx'
import { Check, ChevronDown } from 'lucide-react'
import React from 'react'

interface Item<T> {
  value: T
  label: string
}

export interface Props<T> {
  items: Item<T>[]
  selectedItemLabel?: string
  onSelect?: (item?: Item<T>) => any
  isTransparent?: boolean
}

function Select<T>({ items, selectedItemLabel, onSelect, isTransparent }: Props<T>) {
  function handleSelect(label: string) {
    const newSelected = items.find(i => i.label === label)
    onSelect?.(newSelected)
  }
  return (
    <RadixSelect.Root
      defaultValue={selectedItemLabel}
      onValueChange={handleSelect}
    >
      <RadixSelect.Trigger className={clsx('group flex items-center justify-center space-x-1 rounded border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition-all hover:border-green-800 hover:text-green-800', { 'bg-white': !isTransparent })}>
        <RadixSelect.Value />
        <RadixSelect.Icon>
          <ChevronDown
            className="text-slate-200 transition-all group-hover:text-green-800"
            size="16px"
          />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content className="rounded border z-20 border-slate-200 bg-white p-1 shadow-lg transition-all">
          <RadixSelect.ScrollUpButton />
          <RadixSelect.Viewport className="space-y-0.5">
            {items.map((i, idx, a) => (
              <React.Fragment key={i.label}>
                {!i.value && !i.value && idx !== 0 && <div className="border-b" />}
                <RadixSelect.Item
                  className={clsx(
                    'group flex rounded cursor-pointer relative hover:bg-green-50 justify-between space-x-1 px-3 py-1.5 text-sm text-slate-600 transition-all hover:text-green-800 outline-none border-slate-200'
                  )}
                  value={i.label}
                >
                  <RadixSelect.ItemText className="">{i.label}</RadixSelect.ItemText>
                  <RadixSelect.ItemIndicator>
                    <Check size="16px" />
                  </RadixSelect.ItemIndicator>
                </RadixSelect.Item>
                {!i.value && idx !== a.length - 1 && <div className="border-b" />}
              </React.Fragment>
            ))}
          </RadixSelect.Viewport>
          <RadixSelect.ScrollDownButton />
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  )
}

export default Select
