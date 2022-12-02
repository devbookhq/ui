import { useEffect, useState } from 'react'

import { LanguageServerClient } from './languageServerClient'
import { LanguageServer } from './languageServerProcess'
import { startLS } from './lsp'
import { getRootURI } from './utils'

export type LSClients = {
  [key: string]: LanguageServerClient
}

function useLanguageServerClients({
  rootdir,
  server,
}: {
  server?: LanguageServer
  rootdir: string
}) {
  const [state, setState] = useState<{
    clients?: LSClients
    server: LanguageServer
  }>()

  useEffect(
    function init() {
      if (!server) return

      setState({ server })

      Promise.all(
        server.languages.map(async languageID => {
          try {
            const connectionString = await server.getConnectionString(languageID)
            if (!connectionString) return

            // TODO: We need to retry connection to the LS because it may not take a longer to start.
            const { lsp, capabilities } = await startLS({
              rootURI: getRootURI(rootdir),
              connectionString,
            })

            const client = new LanguageServerClient({
              languageID,
              capabilities,
              lsp,
            })

            return client
          } catch (err) {
            const msg = err instanceof Error ? err.message : JSON.stringify(err)
            console.error(msg)
          }
        }),
      ).then(l => {
        const clients = l.reduce<LSClients>((prev, curr) => {
          if (curr) {
            prev[curr.languageID] = curr
          }
          return prev
        }, {})

        setState(s =>
          s?.server === server
            ? {
              ...s,
              clients,
            }
            : s,
        )
      })

      return () => {
        setState(s => {
          if (s?.server === server && s.clients) {
            Object.values(s.clients).map(c => c.close())
          } else {
            return s
          }
        })
      }
    },
    [server, rootdir],
  )

  return state?.clients
}

export default useLanguageServerClients
