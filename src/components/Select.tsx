import * as RadixSelect from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'

interface Item<T> {
  value: T
  label: string
}

export interface Props<T> {
  items: Item<T>[]
  selectedItemLabel?: string
  onSelect?: (item?: Item<T>) => any
}

function Select<T>({ items, selectedItemLabel, onSelect }: Props<T>) {
  function handleSelect(label: string) {
    const newSelected = items.find(i => i.label === label)
    onSelect?.(newSelected)
  }

  return (
    <RadixSelect.Root
      defaultValue={selectedItemLabel}
      onValueChange={handleSelect}
    >
      <RadixSelect.Trigger className="group flex items-center justify-center space-x-1 rounded border border-slate-200 px-3 py-1.5 text-xs text-slate-600 transition-all hover:border-amber-800 hover:text-amber-800">
        <RadixSelect.Value />
        <RadixSelect.Icon>
          <ChevronDown
            className="text-slate-200 transition-all group-hover:text-amber-800"
            size="16px"
          />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>

      <RadixSelect.Portal>
        <RadixSelect.Content className="rounded border border-slate-200 bg-white p-1 shadow-lg transition-all">
          <RadixSelect.ScrollUpButton />
          <RadixSelect.Viewport className="space-y-0.5">
            {items.map(i => (
              <RadixSelect.Item
                className="group flex cursor-pointer justify-between space-x-1 rounded px-3 py-1.5 text-xs text-slate-600 transition-all hover:bg-amber-50 hover:text-amber-800"
                key={i.label}
                value={i.label}
              >
                <RadixSelect.ItemText className="">{i.label}</RadixSelect.ItemText>
                <RadixSelect.ItemIndicator>
                  <Check size="16px" />
                </RadixSelect.ItemIndicator>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
          <RadixSelect.ScrollDownButton />
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  )
}

export default Select
