import { Session } from '@devbookhq/sdk'
import { useEffect, useState } from 'react'

import { LanguageServer } from '../utils/languageServer'
import { Language } from './usePublishedCodeSnippet'

type LanguageServerState = 'closed' | 'opening' | 'open'

function useLanguageServer({
  language,
  session,
  debug,
}: {
  language: Language
  session?: Session
  debug?: boolean
}) {
  const [languageServer, setLanguageServer] = useState<{
    server?: LanguageServer
    state?: LanguageServerState
    error?: Error
  }>({ state: 'closed' })

  useEffect(
    function initializeLanguageServer() {
      if (!session?.process) return

      const server = new LanguageServer(language, session, debug)

      setLanguageServer({ server, state: 'opening' })

      server
        .start()
        .then(process => {
          setLanguageServer(s => (s.server === server ? { ...s, state: 'open' } : s))

          process?.exited.then(() => {
            setLanguageServer(s => (s.server === server ? { state: 'closed' } : s))
          })
        })
        .catch(error =>
          setLanguageServer(s => (s.server === server ? { ...s, error } : s)),
        )

      return () => {
        setLanguageServer(s => (s.server === server ? { state: 'closed' } : s))
        server
          .stop()
          .catch(error =>
            setLanguageServer(s => (s.server === server ? { ...s, error } : s)),
          )
      }
    },
    [session, language, debug],
  )

  return {
    server: languageServer.state === 'open' ? languageServer.server : undefined,
    error: languageServer.error,
  }
}

export default useLanguageServer
