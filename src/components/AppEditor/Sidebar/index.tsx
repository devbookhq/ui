import { Tab } from '@headlessui/react'
import clsx from 'clsx'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'

import { useRootStore } from 'core/BuilderProvider/models/RootStoreProvider'

import Blocks from './Blocks'
import Inspector from './Inspector'

function Sidebar() {
  const { board } = useRootStore()

  const [selectedIdx, setSelectedIdx] = useState(0)

  useEffect(
    function handleSelection() {
      if (board.selectedBlock) {
        setSelectedIdx(0)
      } else {
        setSelectedIdx(1)
      }
    },
    [board.selectedBlock],
  )

  useEffect(
    function handleClick() {
      if (selectedIdx === 0) {
        if (!board.selectedBlock) {
          setSelectedIdx(1)
        }
      }
    },
    [selectedIdx, board.selectedBlock],
  )

  return (
    <div className="min-w-[350px] flex-col items-center space-y-4 border-l border-gray-200 py-4">
      <Tab.Group
        defaultIndex={1}
        selectedIndex={selectedIdx}
        onChange={setSelectedIdx}
      >
        <Tab.List className="mx-4 flex space-x-1 rounded-lg bg-gray-300">
          {['Inspect', 'Blocks'].map(category => (
            <Tab
              key={category}
              className={({ selected }) =>
                clsx(
                  'w-full rounded-lg py-1 text-sm leading-4',
                  'ring-white/60 focus:outline-none focus:ring',
                  selected
                    ? 'border border-gray-200 bg-white shadow'
                    : 'text-gray-50 hover:bg-white/[0.12] hover:text-white',
                )
              }
            >
              {category}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <Inspector />
          </Tab.Panel>

          <Tab.Panel>
            <Blocks />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}

export default observer(Sidebar)
