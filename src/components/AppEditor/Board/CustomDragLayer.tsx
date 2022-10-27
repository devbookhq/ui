import { observer } from 'mobx-react-lite'

import { useBoardDrag } from '../../../core/EditorProvider/useBoardDrag'

function CustomDragLayer() {
  const draggedChildren = useBoardDrag()

  if (!draggedChildren) return null

  return (
    <div className="pointer-events-none fixed left-0 top-0 z-50 h-full w-full">
      {draggedChildren}
    </div>
  )
}

export default observer(CustomDragLayer)
