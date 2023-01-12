import type { Session } from '@devbookhq/sdk'
import { useEffect, useState } from 'react'

import { LanguageServer } from './languageServerProcess'
import { LanguageSetup } from './setup'

function useExternalLanguageServer({
  supportedLanguages,
  session,
  debug,
  port,
  bootstrap,
}: {
  port: number,
  supportedLanguages: LanguageSetup[]
  session?: Session
  debug?: boolean
  bootstrap?: boolean
}) {
  const [server, setServer] = useState<LanguageServer>()

  useEffect(
    function init() {
      if (!session?.process) return

      const url = session.getHostname(port)
      const websocketURL = `wss://${url}`

      const externalServer: LanguageServer = {
        languages: (bootstrap ? supportedLanguages.filter(l => !!l.languageServerCommand) : supportedLanguages.filter(l => l.defaultServerCapabilities)).map(l => l.languageID),
        async getConnectionString(languageID) {
          const opts = supportedLanguages.find(l => l.languageID === languageID)
          if (!opts) return
          return encodeURI(`${websocketURL}?name=${opts.languageServerCommand}`)
        },
        getDefaultCapabilities(languageID: string) {
          return !bootstrap ? supportedLanguages.find(l => l.languageID === languageID)?.defaultServerCapabilities : undefined
        },
      }

      setServer(externalServer)
    },
    [
      session,
      debug,
      supportedLanguages,
      bootstrap,
      port,
    ],
  )

  return server
}

export default useExternalLanguageServer
