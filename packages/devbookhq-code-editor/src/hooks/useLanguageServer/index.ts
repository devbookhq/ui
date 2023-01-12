import type { Session } from '@devbookhq/sdk'

import { LanguageSetup } from './setup'
import useLanguageServerClients from './useLanguageServerClients'
import useLanguageServerProcess from './useLanguageServerProcess'

function useLanguageServer({
  supportedLanguages,
  session,
  debug,
  rootdir,
}: {
  supportedLanguages: LanguageSetup[]
  session?: Session
  debug?: boolean
  rootdir: string
}) {

  const server = useLanguageServerProcess({
    supportedLanguages,
    rootdir,
    debug,
    session,
  })

  const clients = useLanguageServerClients({
    rootdir,
    server,
  })

  return clients
}

export default useLanguageServer
