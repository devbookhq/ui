import type { Extension } from '@codemirror/state'
import { ServerCapabilities } from 'vscode-languageserver-protocol'

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
  defaultServerCapabilities?: ServerCapabilities
}

export function getLanguageSetup(filename: string, supportedLanguages: LanguageSetup[]) {
  return supportedLanguages.find(({ fileExtensions }) =>
    fileExtensions?.some(ext => filename.endsWith(ext)),
  )
}

export type { ServerCapabilities }