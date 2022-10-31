import clsx from 'clsx'
import { observer } from 'mobx-react-lite'

import Text from 'components/typography/Text'

import { getGridStyle, xStep, yStep } from 'core/EditorProvider/grid'
import { useRootStore } from 'core/EditorProvider/models/RootStoreProvider'
import { canvasClass, useBoard } from 'core/EditorProvider/useBoard'

import { UI } from '../uiComponents'
import SidebarDraggingLayer from './SidebarDraggingLayer'

export const headerBoardHeight = 90

const gridStyle = getGridStyle(xStep, yStep, '#94a3b8')

function Board() {
  const { ref, boardBlocks } = useBoard()
  const { board } = useRootStore()

  return (
    <div className="flex flex-1 overflow-hidden">
      <div
        className={clsx('relative', 'bg-slate-50', 'flex', 'flex-1', canvasClass)}
        ref={ref}
        style={gridStyle}
        onClick={board.resetBlockSelection}
      >
        <div
          style={{ height: headerBoardHeight }}
          className=" group absolute flex h-[90px] w-full flex-1 items-center justify-center border-b border-slate-200 hover:bg-slate-100/40"
        >
          <Text
            className="pointer-events-none select-none text-transparent group-hover:text-slate-300"
            text="Header"
            size={Text.size.S1}
          />
        </div>
        {boardBlocks.map(b => (
          <UI.EditorBoardBlock
            {...b}
            isSelected={b.id === board.selectedBlock?.id}
            key={b.id}
          />
        ))}
      </div>
      <SidebarDraggingLayer />
    </div>
  )
}

export default observer(Board)
