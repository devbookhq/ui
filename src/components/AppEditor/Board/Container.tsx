import clsx from 'clsx'
import { observer } from 'mobx-react-lite'

import { getGridStyle, xStep, yStep } from 'core/BuilderProvider/grid'
import { useRootStore } from 'core/BuilderProvider/models/RootStoreProvider'

import { canvasClass, useBoard } from '../../../core/BuilderProvider/useBoard'
import { UI, uiComponentsSetup } from '../uiComponents'

const gridStyle = getGridStyle(xStep, yStep, '#9ca3af')

function Container() {
  const { ref } = useBoard(uiComponentsSetup)
  const { board } = useRootStore()

  return (
    <div
      className={clsx('relative', 'bg-gray-50', 'flex', 'flex-1', canvasClass)}
      ref={ref}
      style={gridStyle}
      onClick={board.resetBlockSelection}
    >
      {board.boardBlocks.map(b => (
        <UI.EditorBoardBlock
          {...b}
          isSelected={b.id === board.selectedBlock?.id}
          key={b.id}
        />
      ))}
    </div>
  )
}

export default observer(Container)
