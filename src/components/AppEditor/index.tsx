import { SessionProvider } from '@devbookhq/react'

import { App } from 'queries/types'

import BuilderProvider from 'core/BuilderProvider'

import Board from './Board'
import Sidebar from './Sidebar'
import useSaveApp from './useSaveApp'

export interface Props {
  app: App
}

function AppEditor({ app }: Props) {
  const saveAppState = useSaveApp(app.id)

  return (
    <div className="flex flex-1 border-gray-200">
      <BuilderProvider
        initialState={app.state}
        onStateChange={saveAppState}
      >
        <SessionProvider
          opts={{
            codeSnippetID: 'Mh3XS5Pq9ch8',
          }}
        >
          <div className="flex flex-1 flex-col">
            <Board />
          </div>
          <Sidebar />
        </SessionProvider>
      </BuilderProvider>
    </div>
  )
}

export default AppEditor
