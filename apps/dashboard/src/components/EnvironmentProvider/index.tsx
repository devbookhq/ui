import { SharedSessionProvider } from '@devbookhq/react'
import { observer } from 'mobx-react-lite'
import { PropsWithChildren, createContext } from 'react'

import { useRootStore } from '../../core/EditorProvider/models/RootStoreProvider'
import ResourceProvider from './ResourceProvider'

const EnvironmentContext = createContext(null)

function EnvironmentProvider({ children }: PropsWithChildren) {
  const { resources } = useRootStore()

  return (
    <EnvironmentContext.Provider value={null}>
      <SharedSessionProvider
        opts={{
          codeSnippetID: resources.environmentID,
          inactivityTimeout: 0,
        }}
      >
        <ResourceProvider>{children}</ResourceProvider>
      </SharedSessionProvider>
    </EnvironmentContext.Provider>
  )
}

export default observer(EnvironmentProvider)
