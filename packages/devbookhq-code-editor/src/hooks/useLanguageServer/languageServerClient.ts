import * as LSP from 'vscode-languageserver-protocol'
import { ServerCapabilities } from 'vscode-languageserver-protocol'

import { logger } from '@devbookhq/utils'
import { LanguageServerPlugin } from './languageServerPlugin'
import { LSPConnection } from './lsp/lspConnection'

interface LanguageServerClientOpts {
  languageID: string
  lsp: LSPConnection
  capabilities: ServerCapabilities<any>
}

export class LanguageServerClient {
  public readonly lsp: LSPConnection
  public readonly capabilities: ServerCapabilities<any>
  public readonly languageID: string

  private readonly plugins: LanguageServerPlugin[] = []

  constructor(options: LanguageServerClientOpts) {
    this.languageID = options.languageID
    this.lsp = options.lsp
    this.capabilities = options.capabilities

    const log = logger(`LSP - ${this.languageID}`, 'blue')

    this.lsp.onDiagnostics(this.processDiagnostics.bind(this))
    this.lsp.onError(data => {
      log('Error in language service', data)
    })

    this.lsp.onLogMessage(data => {
      // log('Log in language service', data)
    })

    this.lsp.onShowMessage(data => {
      // log('User message in language service', data)
    })
  }

  close() {
    this.lsp.dispose()
  }

  attachPlugin(plugin: LanguageServerPlugin) {
    this.plugins.push(plugin)
  }

  detachPlugin(plugin: LanguageServerPlugin) {
    const i = this.plugins.indexOf(plugin)
    if (i === -1) return
    this.plugins.splice(i, 1)
  }

  private processDiagnostics(diagnostics: LSP.PublishDiagnosticsParams) {
    for (const plugin of this.plugins) {
      plugin.onDiagnostics(diagnostics)
    }
  }
}
