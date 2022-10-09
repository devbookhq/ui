import { Session } from '@devbookhq/sdk'
import { WebSocketTransport } from '@open-rpc/client-js'

import { Language } from '../hooks/usePublishedCodeSnippet'
import { createDeferredPromise } from './createDeferredPromise'
import { createSessionProcess } from './createSessionProcess'
import Logger from './logger'

interface LanguageOptions {
  fileExtensions: string[]
  serverCommand: string
  languageID: string
}

const rootdir = '/code'

// The language server ws wrapper was installed with the following commands:
// curl -L https://github.com/qualified/lsp-ws-proxy/releases/download/v0.9.0-rc.4/lsp-ws-proxy_linux-musl.tar.gz > lsp-ws-proxy.tar.gz
// tar -zxvf lsp-ws-proxy.tar.gz
// mv lsp-ws-proxy /usr/bin/
// rm lsp-ws-proxy.tar.gz

const languageOptions: { [lang in Language]?: LanguageOptions } = {
  Nodejs: {
    // Necessary packages were installed by `npm i -g typescript-language-server typescript`
    serverCommand: 'lsp-ws-proxy -l 9999 -- typescript-language-server --stdio',
    fileExtensions: ['.js', '.ts', '.tsx', '.jsx'],
    languageID: 'typescript',
  },
}

/**
 *
 * {@link https://github.com/microsoft/TypeScript-wiki/blob/main/Standalone-Server-(tsserver).md tsserver info}
 *
 * {@link https://github.com/microsoft/TypeScript/blob/main/src/server/protocol.ts tsserver protocol}
 *
 * {@link https://github.com/FurqanSoftware/codemirror-languageserver codemirror LS package - needs changes to transport and }
 *
 */
export class LanguageServer {
  readonly roodir = rootdir

  protected readonly logger: Logger

  private isDestroyed = false
  private isStarted = false
  private languageServer?: Awaited<ReturnType<typeof createSessionProcess>> & {
    websocketURL: string
  }
  private started = createDeferredPromise()
  private readonly languageOptions: LanguageOptions

  constructor(language: Language, private readonly session: Session, debug?: boolean) {
    const langaugeOptions = languageOptions[language]
    if (!langaugeOptions) {
      throw new Error(`Language server options for language "${language}" is not defined`)
    }
    this.languageOptions = langaugeOptions

    this.logger = new Logger('LanguageServer', debug)
    this.logger.log('Language server initialized', this.languageOptions)
  }

  /**
   * `Promise` that resolves when the language server closes.
   *
   * Is `undefined` if the {@link LanguageServer} instance was not started with the {@link LanguageServer.start} method yet.
   *
   * @returns `Promise` that resolves when the {@link LanguageServer} closes or `undefined` if the server was not started yet
   */
  get stoped() {
    return this.languageServer?.exited
  }

  get processID() {
    return this.languageServer?.processID
  }

  get languageID() {
    return this.languageOptions.languageID
  }

  async stop() {
    if (this.isDestroyed) return
    this.isDestroyed = true

    this.logger.log('Closing...')
    await this.languageServer?.kill()
    this.logger.log(`Closed (processID ${this.processID})`)
  }

  async start() {
    if (this.isStarted) {
      await this.started.promise
      return this.languageServer
    }
    this.isStarted = true

    this.logger.log('Opening...')

    const url = this.session.getHostname(9999)

    if (!url) {
      throw new Error('Cannot get session url')
    }

    const websocketURL = `wss://${url}`

    try {
      this.languageServer = {
        ...(await createSessionProcess(
          this.languageOptions.serverCommand,
          this.session.process,
          o => this.logger.log(`Output: ${o.line}`),
          o => this.logger.error(`Error: ${o.line}`),
          {},
          this.roodir,
          'languageServer',
        )),
        websocketURL,
      }

      this.logger.log(`Open (processID ${this.processID})`)
      this.started.resolve()
      return this.languageServer
    } catch (err) {
      this.started.reject()
      throw err
    }
  }

  getDocumentURI(filename: string) {
    return `${this.getRootdirURI()}/${filename}`
  }

  getRootdirURI() {
    return `file://${this.roodir}`
  }

  hasValidExtension(file: string) {
    return this.languageOptions.fileExtensions.some(e => file.endsWith(e))
  }

  async createConnection() {
    const server = await this.start()
    if (!server) return undefined
    return new WebSocketTransport(server.websocketURL)
  }
}
