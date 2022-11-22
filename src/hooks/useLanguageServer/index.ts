import { Extension } from '@codemirror/state'
import type { Session } from '@devbookhq/sdk'
import { useEffect, useState } from 'react'

import { LanguageServerClient } from './languageServerClient'
import { LanguageServerProcess } from './languageServerProcess'
import { startLS } from './lsp'
import useMaybeEmptyPort from './useMaybeEmptyPort'
import { getRootURI } from './utils'

/**
 * The language server ws wrapper was installed with the following commands:
 * ```
 * curl -L https://github.com/qualified/lsp-ws-proxy/releases/download/v0.9.0-rc.4/lsp-ws-proxy_linux-musl.tar.gz > lsp-ws-proxy.tar.gz
 * tar -zxvf lsp-ws-proxy.tar.gz
 * mv lsp-ws-proxy /usr/bin/
 * rm lsp-ws-proxy.tar.gz
 * ```
 */
export interface LanguageSetup {
  languageServerCommand?: string
  fileExtensions: string[]
  languageID: string
  languageExtensions?: Extension
}

export function getLanguageSetup(filename: string, supportedLanguages: LanguageSetup[]) {
  return supportedLanguages.find(({ fileExtensions }) =>
    fileExtensions?.some(ext => filename.endsWith(ext)),
  )
}

export type LSClients = {
  [key: string]: LanguageServerClient
}

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
  const [lsProcess, setLSProcess] = useState<LanguageServerProcess>()
  const [languageServer, setLanguageServer] = useState<{
    clients?: LSClients
    process: LanguageServerProcess
  }>()

  const { maybeEmptyPort, markPortAsNotEmpty } = useMaybeEmptyPort()

  useEffect(
    function initLSProcess() {
      if (!session?.process) return

      const proc = new LanguageServerProcess(
        rootdir,
        supportedLanguages,
        session,
        maybeEmptyPort,
        debug,
      )
      setLSProcess(proc)

      proc
        .start()
        .then(process => {
          process?.exited.then(() => {
            markPortAsNotEmpty()
            setLSProcess(p => (p === proc ? undefined : p))
          })
        })
        .catch(err => console.error('Error starting language server', err))

      return () => {
        setLSProcess(p => (p === proc ? undefined : p))
        proc.stop()
      }
    },
    [session, debug, maybeEmptyPort, markPortAsNotEmpty, supportedLanguages],
  )

  useEffect(
    function initLSClient() {
      if (!lsProcess) return

      setLanguageServer({ process: lsProcess })

      Promise.all(
        lsProcess.languages.map(async languageID => {
          try {
            const connectionString = await lsProcess.getConnectionString(languageID)
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

        setLanguageServer(s =>
          s?.process === lsProcess
            ? {
                process: s.process,
                clients,
              }
            : s,
        )
      })

      return () => {
        setLanguageServer(s => {
          if (s?.process === lsProcess && s.clients) {
            Object.values(s.clients).map(c => c.close())
          } else {
            return s
          }
        })
      }
    },
    [lsProcess, rootdir],
  )

  return languageServer?.clients
}

export default useLanguageServer
