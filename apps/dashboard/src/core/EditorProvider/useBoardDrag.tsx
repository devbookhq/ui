import { useDragLayer } from 'react-dnd'

import { UI } from 'components/AppEditor/uiComponents'

import { sidebarIconType } from '..'
import { getBlockOffset } from './grid'
import { DraggedSidebarBlock, getCanvasCoordinates } from './useBoard'

export function useBoardDrag() {
  const { sidebarOffset, isDragging, block, isSidebarItem } = useDragLayer(monitor => ({
    isDragging: monitor.isDragging(),
    block: monitor.getItem<DraggedSidebarBlock | undefined>(),
    isSidebarItem: monitor.getItemType() === sidebarIconType,
    sidebarOffset: monitor.getClientOffset(),
  }))

  if (!isDragging) return null
  if (!block) return null

  if (isSidebarItem) {
    const canvas = getCanvasCoordinates()
    const offset = getBlockOffset(canvas, sidebarOffset)

    if (!offset) return null

    return (
      <UI.ViewBoardBlock
        {...block}
        left={offset.x}
        outlineEnabled={true}
        top={offset.y}
      />
    )
  }
  return null
}
