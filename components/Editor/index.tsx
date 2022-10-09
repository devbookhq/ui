import { SharedSessionProvider } from '@devbookhq/react'
import { DndProvider } from 'react-dnd'
import { App } from 'types'

import useDndBackend from 'utils/useDndBackend'

import Board from './Board'
import Sidebar from './Sidebar'

export interface Props {
  app: App
}

function Editor({ app }: Props) {
  const backend = useDndBackend()

  return (
    <div className="flex flex-1 rounded border border-black-700">
      <SharedSessionProvider
        opts={{
          codeSnippetID: 'Mh3XS5Pq9ch8',
        }}
      >
        <DndProvider backend={backend}>
          <Board app={app} />
          <Sidebar />
        </DndProvider>
      </SharedSessionProvider>
    </div>
  )
}

export default Editor
