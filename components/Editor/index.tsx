import { DndProvider } from 'react-dnd'

import Sidebar from './Sidebar'
import Board from './Board'
import useDndBackend from 'utils/useDndBackend'

function Editor() {
  const backend = useDndBackend()

  return (
    <DndProvider backend={backend}>
      <Board />
      <Sidebar />
    </DndProvider>
  )
}

export default Editor
