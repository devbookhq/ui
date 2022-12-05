import type { Session } from '@devbookhq/sdk'
import { useEffect, useState } from 'react'

import { LanguageServerProcess } from './languageServerProcess'
import { LanguageSetup } from './setup'
import useMaybeEmptyPort from './useMaybeEmptyPort'

function useLanguageServerProcess({
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
  const [serverProcess, setServerProcess] = useState<LanguageServerProcess>()
  const { maybeEmptyPort, markPortAsNotEmpty } = useMaybeEmptyPort()

  useEffect(
    function init() {
      if (!session?.process) return

      const proc = new LanguageServerProcess(
        rootdir,
        supportedLanguages,
        session,
        maybeEmptyPort,
        debug,
      )
      setServerProcess(proc)

      proc
        .start()
        .then(process => {
          process?.exited.then(() => {
            markPortAsNotEmpty()
            setServerProcess(p => (p === proc ? undefined : p))
          })
        })
        .catch(err => console.error('Error starting language server', err))

      return () => {
        setServerProcess(p => (p === proc ? undefined : p))
        proc.stop()
      }
    },
    [
      session,
      debug,
      maybeEmptyPort,
      markPortAsNotEmpty,
      supportedLanguages,
      rootdir,
    ],
  )

  return serverProcess
}

export default useLanguageServerProcess
