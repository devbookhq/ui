import { DndProvider } from 'react-dnd'

import Sidebar from './Sidebar'
import Board from './Board'
import useDndBackend from 'utils/useDndBackend'

function Editor() {
  const backend = useDndBackend()

  return (
    <div className="flex flex-1">
      <DndProvider backend={backend}>
        <Board />
        <Sidebar />
      </DndProvider>
    </div>
  )
}

export default Editor
