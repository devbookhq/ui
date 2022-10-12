import { XYCoord, useDragLayer } from 'react-dnd'

import { renderDraggedBoardBlock } from 'components/Editor/uiComponents'

import { sidebarIconType } from '..'
import { BoardBlock } from './models/board'
import { snapToGrid, xStep, yStep } from './snapToGrid'

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
  const {
    isDragging,
    block,
    initialOffset,
    currentOffset,
    isSidebarItem,
    sidebarCurrentOffset,
    sidebarInitialOffset,
  } = useDragLayer(monitor => ({
    block: monitor.getItem<BoardBlock | undefined>(),
    isSidebarItem: monitor.getItemType() === sidebarIconType,
    itemType: monitor.getItemType(),
    sidebarInitialOffset: monitor.getInitialClientOffset(),
    sidebarCurrentOffset: monitor.getClientOffset(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }))

  if (!isDragging) return
  if (!block) return

  const offset = isSidebarItem
    ? getBlockOffset(sidebarInitialOffset, currentOffset)
    : getBlockOffset(initialOffset, currentOffset)

  return offset && renderDraggedBoardBlock(block, offset)
}
