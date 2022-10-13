import { XYCoord, useDragLayer } from 'react-dnd'

import { renderDraggedBoardBlock } from 'components/Editor/uiComponents'

import { sidebarIconType } from '..'
import { snapToGrid, xStep, yStep } from './grid'
import { BoardBlock } from './models/board'
import { getCanvas } from './useBoard'

renderDraggedBoardBlock

function getBlockOffset(
  initialOffset: XYCoord | null,
  currentOffset: XYCoord | null,
): XYCoord | undefined {
  if (!initialOffset || !currentOffset) {
    return
  }

  let { x, y } = currentOffset

  x -= initialOffset.x
  y -= initialOffset.y

  x = snapToGrid(x, xStep)
  y = snapToGrid(y, yStep)

  x += initialOffset.x
  y += initialOffset.y

  return { x, y }
}

export function useBoardDrag() {
  const { isDragging, block, initialOffset, currentOffset, isSidebarItem } = useDragLayer(
    monitor => ({
      block: monitor.getItem<BoardBlock | undefined>(),
      isSidebarItem: monitor.getItemType() === sidebarIconType,
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
    }),
  )

  if (!isDragging) return
  if (!block) return

  let offset: XYCoord | undefined

  if (isSidebarItem) {
    const canvas = getCanvas()
    offset = getBlockOffset({ x: canvas.left, y: canvas.top }, currentOffset)
  } else {
    offset = getBlockOffset(initialOffset, currentOffset)
  }

  return offset && renderDraggedBoardBlock(block, offset)
}
