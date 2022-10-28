import { SessionProvider } from '@devbookhq/react'
import { observer } from 'mobx-react-lite'
import { PropsWithChildren, createContext, useEffect } from 'react'

import { showErrorNotif } from 'utils/notification'

import { useRootStore } from './models/RootStoreProvider'
import { getURL } from './resources/cockroachDB'

const ResourceContext = createContext(null)

export interface Props {}

function ResourceProvider({ children }: PropsWithChildren<Props>) {
  const { resources } = useRootStore()

  useEffect(
    function handleCockroachDB() {
      ;(async function () {
        if (resources.cockroachDB) {
          try {
            const url = await getURL(resources.cockroachDB.cached)
            resources.cockroachDB.setURL(url)
          } catch (err) {
            const msg = err instanceof Error ? err.message : String(err)
            showErrorNotif(msg)
          }
        }
      })()
    },
    [resources.cockroachDB, resources],
  )

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
