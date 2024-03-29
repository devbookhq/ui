import {
  createMessageConnection as createMessageConnectionRW,
  Logger,
} from 'vscode-jsonrpc'

import { createMessageReader } from './reader'
import { createMessageWriter } from './writer'

/**
 * Create VSCode JSON RPC `MessageConnection` over WebSocket.
 * @param webSocket
 * @param logger
 */
export const createMessageConnection = (
  webSocket: WebSocket,
  logger: Logger = createConsoleLogger(),
) =>
  new Promise<ReturnType<typeof createMessageConnectionRW>>(onConnection => {
    webSocket.onopen = () => {
      const conn = createMessageConnectionRW(
        createMessageReader(webSocket),
        createMessageWriter(webSocket),
        logger,
      )
      conn.onDispose(() => webSocket.close())
      conn.onClose(() => conn.dispose())
      onConnection(conn)
    }
  })

const createConsoleLogger = (): Logger => ({
  error: (message: string) => console.error(message),
  warn: (message: string) => console.warn(message),
  info: (message: string) => console.info(message),
  log: (message: string) => console.log(message),
})
