import {
  FilesystemOperation,
  Session,
} from '@devbookhq/sdk'

import {
  useEffect,
  useMemo,
} from 'react'
import { getFileURI } from './useLanguageServer/utils'
import { LSClients } from './useLanguageServer/useLanguageServerClients'
import useWatchFile from './useWatchFile'

export interface Opts {
  /**
   * File on this path must not currently be open in a text editor
   */
  filepath: string
  clients?: LSClients
  session?: Session
  /**
   * Identifies which language server client from the `clients` array should be notified on file changes.
   */
  languageID: string
}

function useLSWatch({
  filepath,
  clients,
  languageID,
  session,
}: Opts) {
  const client = clients?.[languageID]

  const onChange = useMemo(() => {
    if (client) {
      return async ({ operation }: { operation: FilesystemOperation }) => {
        if (!session?.filesystem) return

        if (operation === FilesystemOperation.Write) {
          // TODO: This is a temporary way to force the language server to reload file that was not managed by the client before.
          const text = await session.filesystem.read(filepath)
          await client.lsp.textDocumentOpened({
            textDocument: {
              version: 0,
              languageId: client.languageID,
              text,
              uri: getFileURI(filepath),
            },
          })
          await client.lsp.textDocumentClosed({ textDocument: { uri: getFileURI(filepath) } })
        }
      }
    }
  }, [
    client,
    session,
    filepath,
  ])

  useEffect(function init() {
    onChange?.({ operation: FilesystemOperation.Write })
  }, [onChange])

  useWatchFile({
    filepath,
    onChange,
    session,
  })
}

export default useLSWatch
