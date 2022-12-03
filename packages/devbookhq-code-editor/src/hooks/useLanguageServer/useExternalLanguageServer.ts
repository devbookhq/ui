import type { Session } from '@devbookhq/sdk'
import { useEffect, useState } from 'react'

import { LanguageServer } from './languageServerProcess'
import { LanguageSetup } from './setup'

function useExternalLanguageServer({
  supportedLanguages,
  session,
  debug,
  port,
}: {
  port: number,
  supportedLanguages: LanguageSetup[]
  session?: Session
  debug?: boolean
}) {
  const [server, setServer] = useState<LanguageServer>()

  useEffect(
    function init() {
      if (!session?.process) return

      const url = session.getHostname(port)
      const websocketURL = `wss://${url}`

      const externalServer: LanguageServer = {
        languages: supportedLanguages.map(l => l.languageID),
        async getConnectionString(languageID) {
          const opts = supportedLanguages.find(l => l.languageID === languageID)
          if (!opts) return
          return encodeURI(`${websocketURL}?name=${opts.languageServerCommand}`)
          // return encodeURI(`${websocketURL}/${opts.languageServerCommand}`)
          // return encodeURI(websocketURL)
          // return 'wss://5523-s2v8pklf-7f9db52e.ondevbook.com/ '
        },
        getDefaultCapabilities(languageID: string) {
          return supportedLanguages.find(l => l.languageID === languageID)?.defaultServerCapabilities
        },
      }

      setServer(externalServer)
    },
    [
      session,
      debug,
      supportedLanguages,
      port,
    ],
  )

  return server
}

export default useExternalLanguageServer
