import { XYCoord, useDragLayer } from 'react-dnd'

import { UI } from 'components/AppEditor/uiComponents'

import { sidebarIconType } from '..'
import { snapToGrid, xStep, yStep } from './grid'
import { useRootStore } from './models/RootStoreProvider'
import { BoardBlock } from './models/board'
import { getCanvas } from './useBoard'

function getBlockOffset(
  initialOffset: XYCoord | null,
  currentOffset: XYCoord | null,
): XYCoord | null {
  if (!initialOffset || !currentOffset) {
    return null
  }

  let { x, y } = currentOffset

  x -= initialOffset.x
  y -= initialOffset.y

  x = snapToGrid(x, xStep)
  y = snapToGrid(y, yStep)

  x += initialOffset.x
  y += initialOffset.y

  x = Math.round(x)
  y = Math.round(y)

  return { x, y }
}

export function useBoardDrag() {
  const { sidebarOffset, isDragging, block, isSidebarItem, delta } = useDragLayer(
    monitor => ({
      block: monitor.getItem<BoardBlock | undefined>(),
      isSidebarItem: monitor.getItemType() === sidebarIconType,
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
      sidebarOffset: monitor.getClientOffset(),
      delta: monitor.getDifferenceFromInitialOffset(),
      isDragging: monitor.isDragging(),
    }),
  )

  const { board } = useRootStore()

  if (!block) return null
  if (!isDragging) return null

  if (isSidebarItem) {
    const canvas = getCanvas()
    const offset = getBlockOffset({ x: canvas.left, y: canvas.top }, sidebarOffset)

    if (!offset) return null

    return (
      <UI.ViewBoardBlock
        {...block}
        left={offset.x}
        top={offset.y}
      />
    )
  } else {
    if (!delta) return null

    const left = snapToGrid(block.left + delta.x, xStep)
    const top = snapToGrid(block.top + delta.y, yStep)

    board.getBlock(block.id)?.translate(top, left)

    return null
  }
}
