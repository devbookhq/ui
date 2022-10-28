import clsx from 'clsx'
import { observer } from 'mobx-react-lite'

import { getGridStyle, xStep, yStep } from 'core/EditorProvider/grid'
import { useRootStore } from 'core/EditorProvider/models/RootStoreProvider'
import { canvasClass, useBoard } from 'core/EditorProvider/useBoard'

import { UI } from '../uiComponents'
import SidebarDraggingLayer from './SidebarDraggingLayer'

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
