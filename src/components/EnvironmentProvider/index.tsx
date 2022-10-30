import { SessionProvider } from '@devbookhq/react'
import { observer } from 'mobx-react-lite'
import { PropsWithChildren, createContext } from 'react'

import { useRootStore } from '../../core/EditorProvider/models/RootStoreProvider'
import ResourceProvider from './ResourceProvider'

const EnvironmentContext = createContext(null)

function EnvironmentProvider({ children }: PropsWithChildren) {
  const { resources } = useRootStore()

  return (
    <EnvironmentContext.Provider value={null}>
      <SessionProvider
        opts={{
          codeSnippetID: resources.environmentID,
        }}
      >
        <ResourceProvider>{children}</ResourceProvider>
      </SessionProvider>
    </EnvironmentContext.Provider>
  )
}

export default observer(EnvironmentProvider)
