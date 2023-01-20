import * as RadixTabs from '@radix-ui/react-tabs'
import React from 'react'

import Text from './typography/Text'

interface Tab {
  component: React.ReactNode
  label: string
  value: string
}

export interface Props {
  tabs: Tab[]
  defaultValue: string
}

function Tabs({ tabs, defaultValue }: Props) {
  return (
    <RadixTabs.Root
      defaultValue={defaultValue}
      defaultChecked
    >
      <RadixTabs.List
        className="flex flex-1 space-x-1 border-b border-slate-200 px-3"
        defaultValue="blocks"
        defaultChecked
      >
        {tabs.map(t => (
          <RadixTabs.Trigger
            className="group relative flex justify-center py-3 px-1"
            key={t.value}
            value={t.value}
            defaultChecked
          >
            <Text
              className="text-slate-300 transition-all group-hover:text-green-800 group-radix-state-active:text-green-800"
              size={Text.size.S3}
              text={t.label}
            />
            <div className="absolute bottom-0 -mb-px w-full rounded-t border-b-2 border-transparent transition-all group-radix-state-active:border-green-400"></div>
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
      <div className="py-1">
        {tabs.map(t => (
          <RadixTabs.Content
            key={t.value}
            value={t.value}
          >
            <div className="flex flex-wrap items-center py-2 px-3">{t.component}</div>
          </RadixTabs.Content>
        ))}
      </div>
    </RadixTabs.Root>
  )
}

export default Tabs
