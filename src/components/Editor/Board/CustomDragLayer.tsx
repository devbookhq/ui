import type { CSSProperties } from 'react'

import { useBoardDrag } from '../../../core/BuilderProvider/useBoardDrag'

const layerStyles: CSSProperties = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
}

export interface Props {}

function CustomDragLayer({}: Props) {
  const draggedChildren = useBoardDrag()

  if (!draggedChildren) return null

  return <div style={layerStyles}>{draggedChildren}</div>
}

export default CustomDragLayer
