import { observer } from 'mobx-react-lite'

import { useBoardDrag } from 'core/EditorProvider/useBoardDrag'

function SidebarDraggingLayer() {
  const draggedSidebarBlock = useBoardDrag()

  if (!draggedSidebarBlock) return null

  return (
    <div className="pointer-events-none fixed left-0 top-0 z-40 h-full w-full">
      {draggedSidebarBlock}
    </div>
  )
}

export default observer(SidebarDraggingLayer)
