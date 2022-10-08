import { SharedSessionProvider } from '@devbookhq/react'
import { DndProvider } from 'react-dnd'

import useDndBackend from 'utils/useDndBackend'

import Board from './Board'
import Sidebar from './Sidebar'

function Editor() {
  const backend = useDndBackend()

  return (
    <div className="flex flex-1 rounded border border-black-700">
      <SharedSessionProvider
        opts={{
          codeSnippetID: 'Mh3XS5Pq9ch8',
        }}
      >
        <DndProvider backend={backend}>
          <Board />
          <Sidebar />
        </DndProvider>
      </SharedSessionProvider>
    </div>
  )
}

export default Editor
