import type { CSSProperties } from 'react'
import { useDragLayer } from 'react-dnd'
import { renderDraggedBoardItem } from '../UIComponent'

const layerStyles: CSSProperties = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
}

export interface Props {
}

function CustomDragLayer({ }: Props) {
  const {
    isDragging,
    item,
    initialOffset,
    currentOffset,
  } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }))

  if (!isDragging) {
    return null
  }

  return (
    <div style={layerStyles}>
      {renderDraggedBoardItem(item, initialOffset, currentOffset)}
    </div>
  )
}

export default CustomDragLayer
