import { XYCoord, useDragLayer } from 'react-dnd'

import { UI } from 'components/AppEditor/uiComponents'

import { sidebarIconType } from '..'
import { snapToGrid, xStep, yStep } from './grid'
import { BoardBlock } from './models/board'
import { getCanvas } from './useBoard'

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

  x = Math.round(x)
  y = Math.round(y)

  return { x, y }
}

export function useBoardDrag() {
  const {
    sidebarOffset,
    isDragging,
    block,
    initialOffset,
    currentOffset,
    isSidebarItem,
  } = useDragLayer(monitor => ({
    block: monitor.getItem<BoardBlock | undefined>(),
    isSidebarItem: monitor.getItemType() === sidebarIconType,
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    sidebarOffset: monitor.getClientOffset(),
    isDragging: monitor.isDragging(),
  }))

  if (!block) return
  if (!isDragging) return

  let offset: XYCoord | undefined

  if (isSidebarItem) {
    const canvas = getCanvas()
    offset = getBlockOffset({ x: canvas.left, y: canvas.top }, sidebarOffset)
  } else {
    offset = getBlockOffset(initialOffset, currentOffset)
  }

  if (!offset) return null

  return (
    <UI.DraggedBoardBlock
      {...block}
      offset={offset}
    />
  )
}
