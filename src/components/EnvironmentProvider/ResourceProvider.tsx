import { useProvidedSession } from '@devbookhq/react'
import { observer } from 'mobx-react-lite'
import { PropsWithChildren, createContext, useEffect } from 'react'

import { showErrorNotif } from 'utils/notification'

import { useRootStore } from '../../core/EditorProvider/models/RootStoreProvider'
import { getURL } from '../../core/EditorProvider/resources/cockroachDB'

const ResourceContext = createContext(null)

export interface Props {}

function ResourceProvider({ children }: PropsWithChildren<Props>) {
  const { resources } = useRootStore()
  const { session } = useProvidedSession()

  useEffect(
    function getCockroachDB() {
      ;(async function () {
        if (resources.cockroachDB) {
          try {
            const url = await getURL(resources.cockroachDB.cached)
            resources.cockroachDB.setURL(url)
          } catch (err) {
            const msg = err instanceof Error ? err.message : JSON.stringify(err)
            showErrorNotif(msg)
          }
        }
      })()
    },
    [resources.cockroachDB, resources],
  )

  useEffect(
    function handleCockroachDB() {
      ;(async function () {
        if (
          resources.cockroachDB?.enabled &&
          resources.cockroachDB?.url &&
          resources.cockroachDB.outputFile
        ) {
          try {
            await session?.filesystem?.write(
              resources.cockroachDB.outputFile,
              resources.cockroachDB.outputStringFormat
                ? resources.cockroachDB.outputStringFormat.replace(
                    '${{URL}}',
                    resources.cockroachDB.url,
                  )
                : resources.cockroachDB.url,
            )
          } catch (err) {
            const msg = err instanceof Error ? err.message : JSON.stringify(err)
            showErrorNotif(msg)
          }
        }
      })()
    },
    [
      resources.cockroachDB?.url,
      resources.cockroachDB?.outputFile,
      resources.cockroachDB?.outputStringFormat,
      resources.cockroachDB?.enabled,
      session?.filesystem,
    ],
  )

  return <ResourceContext.Provider value={null}>{children}</ResourceContext.Provider>
}

export default observer(ResourceProvider)
