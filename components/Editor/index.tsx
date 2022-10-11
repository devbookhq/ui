import { SessionProvider } from '@devbookhq/react'
import { DndProvider } from 'react-dnd'

import useDndBackend from 'components/BuilderProvider/useDndBackend'

import { App } from 'utils/queries/types'

import Board from './Board'
import Inspector from './Inspector'
import Sidebar from './Sidebar'

export interface Props {
  app: App
}

function Editor({ app }: Props) {
  const backend = useDndBackend()

  return (
    <div className="flex flex-1 rounded border border-black-700">
      <SessionProvider
        opts={{
          codeSnippetID: 'Mh3XS5Pq9ch8',
        }}
      >
        <DndProvider backend={backend}>
          <div className="flex flex-1 flex-col">
            <Board app={app} />
            <Inspector />
          </div>
          <Sidebar />
        </DndProvider>
      </SessionProvider>
    </div>
  )
}

export default Editor
