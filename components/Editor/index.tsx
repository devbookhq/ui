import { SessionProvider } from '@devbookhq/react'
import { DndProvider } from 'react-dnd'
import { App } from 'types'

import useDndBackend from 'components/BuilderProvider/useDndBackend'

import Board from './Board'
import Sidebar from './Sidebar'

export interface Props {
  app: App
}

function Editor({ app }: Props) {
  const backend = useDndBackend()

  console.log('editor')

  return (
    <div className="flex flex-1 rounded border border-black-700">
      <SessionProvider
        opts={{
          codeSnippetID: 'Mh3XS5Pq9ch8',
        }}
      >
        <DndProvider backend={backend}>
          <Board app={app} />
          <Sidebar />
        </DndProvider>
      </SessionProvider>
    </div>
  )
}

export default Editor
