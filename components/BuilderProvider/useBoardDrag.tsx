import { XYCoord, useDragLayer } from 'react-dnd'

import { renderDraggedBoardItem, sidebarIconType } from '../Editor/UIComponent'
import { snapToGrid, xStep, yStep } from './snapToGrid'

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
    item,
    initialOffset,
    currentOffset,
    isSidebarItem,
    sidebarCurrentOffset,
    sidebarInitialOffset,
  } = useDragLayer(monitor => ({
    item: monitor.getItem(),
    isSidebarItem: monitor.getItemType() === sidebarIconType,
    itemType: monitor.getItemType(),
    sidebarInitialOffset: monitor.getInitialClientOffset(),
    sidebarCurrentOffset: monitor.getClientOffset(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }))

  if (!isDragging) return

  const offset = isSidebarItem
    ? getBlockOffset(sidebarInitialOffset, currentOffset)
    : getBlockOffset(initialOffset, currentOffset)

  return offset && renderDraggedBoardItem(item, offset)
}
