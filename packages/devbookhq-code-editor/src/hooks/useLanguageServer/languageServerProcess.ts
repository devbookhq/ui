import { Session, createSessionProcess } from '@devbookhq/sdk'

import { createDeferredPromise, Logger, notEmpty } from '../../utils'
import { LanguageSetup } from './setup'

// The language server ws wrapper was installed with the following commands:
// curl -L https://github.com/qualified/lsp-ws-proxy/releases/download/v0.9.0-rc.4/lsp-ws-proxy_linux-musl.tar.gz > lsp-ws-proxy.tar.gz
// tar -zxvf lsp-ws-proxy.tar.gz
// mv lsp-ws-proxy /usr/bin/
// rm lsp-ws-proxy.tar.gz

export interface LanguageServer {
  readonly languages: string[]
  getConnectionString: (languageID: string) => Promise<string | undefined>
}

export class LanguageServerProcess implements LanguageServer {
  protected readonly logger: Logger

  private isDestroyed = false
  private isStarted = false
  private languageServer?: Awaited<ReturnType<typeof createSessionProcess>> & {
    websocketURL: string
  }
  private started = createDeferredPromise()
  private readonly serverSetup: Required<LanguageSetup>[]
  private readonly startCmd: string

  constructor(
    private readonly rootdir: string,
    languages: LanguageSetup[],
    private readonly session: Session,
    private readonly port: number,
    debug?: boolean,
  ) {
    this.serverSetup = languages
      .filter(notEmpty)
      .filter((s): s is Required<LanguageSetup> => !!s.languageServerCommand)

    this.startCmd =
      `lsp-ws-proxy -l ${this.port} ` +
      this.serverSetup.map(s => `-- ${s.languageServerCommand} --stdio`).join(' ')
    this.logger = new Logger('LanguageServer', debug)
    this.logger.log('Language server initialized', this.serverSetup)
  }

  get languages() {
    return this.serverSetup.map(s => s.languageID)
  }

  async stop() {
    if (this.isDestroyed) return
    this.isDestroyed = true

    this.logger.log('Closing...')
    await this.languageServer?.kill()
    this.logger.log(`Closed (processID ${this.languageServer?.processID})`)
  }

  async start() {
    if (this.isStarted) {
      await this.started.promise
      return this.languageServer
    }
    this.isStarted = true

    this.logger.log('Opening...')

    const url = this.session.getHostname(this.port)

    if (!url) {
      throw new Error('Cannot get session url')
    }

    const websocketURL = `wss://${url}`

    try {
      this.languageServer = {
        ...(await createSessionProcess({
          cmd: this.startCmd,
          rootdir: this.rootdir,
          manager: this.session.process,
          onStderr: o => this.logger.error(`Error: ${o.line}`),
          onStdout: o => this.logger.log(`Output: ${o.line}`),
        })),
        websocketURL,
      }

      this.logger.log(`Open (processID ${this.languageServer.processID})`)
      this.started.resolve()
      return this.languageServer
    } catch (err) {
      this.started.reject()
      throw err
    }
  }

  async getConnectionString(languageID: string) {
    const opts = this.serverSetup.find(l => l.languageID === languageID)
    if (!opts) return

    const server = await this.start()
    if (!server) return undefined

    return encodeURI(`${server.websocketURL}?name=${opts.languageServerCommand}`)
  }
}
