import { SessionProvider } from '@devbookhq/react'
import { observer } from 'mobx-react-lite'
import { PropsWithChildren, createContext } from 'react'

import { useRootStore } from './models/RootStoreProvider'

const ResourceContext = createContext(null)

export interface Props {}

function ResourceProvider({ children }: PropsWithChildren<Props>) {
  const { resources } = useRootStore()

  return (
    <ResourceContext.Provider value={null}>
      <SessionProvider
        opts={{
          codeSnippetID: resources.environmentID,
        }}
      >
        {children}
      </SessionProvider>
    </ResourceContext.Provider>
  )
}

export default observer(ResourceProvider)
