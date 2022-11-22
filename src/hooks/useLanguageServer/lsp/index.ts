import { DiagnosticTag } from 'vscode-languageserver-protocol'

import { LSPConnection, createLSPConnection } from './lspConnection'
import { createMessageConnection } from './ws'

async function initialize(conn: LSPConnection, rootURI: string) {
  const results = await conn.initialize({
    capabilities: {
      textDocument: {
        synchronization: {
          dynamicRegistration: true,
          // willSave: true,
          // willSaveWaitUntil: true,
          didSave: true,
        },
        completion: {
          dynamicRegistration: true,
          completionItem: {
            snippetSupport: false,
            insertReplaceSupport: false,
            // TODO Commit characters cannot be supported with show-hint addon because by the time the
            //      commit character is detected, the Widget is updated and selected item is gone.
            //      Maybe assign it somewhere inside `select` event.
            commitCharactersSupport: false,
            documentationFormat: ['markdown', 'plaintext'],
            labelDetailsSupport: true,
            deprecatedSupport: true,
            preselectSupport: true,
            resolveSupport: {
              // These are resolved lazily by default
              properties: ['documentation', 'detail'],
            },
          },
          contextSupport: true,
        },
        hover: {
          dynamicRegistration: true,
          contentFormat: ['markdown', 'plaintext'],
        },
        signatureHelp: {
          dynamicRegistration: true,
          signatureInformation: {
            documentationFormat: ['markdown', 'plaintext'],
            parameterInformation: { labelOffsetSupport: true },
            activeParameterSupport: true,
          },
          contextSupport: true,
        },
        // declaration: {
        //   dynamicRegistration: true,
        //   linkSupport: false,
        // },
        // definition: {
        //   dynamicRegistration: true,
        //   linkSupport: true,
        // },
        // typeDefinition: {
        //   dynamicRegistration: true,
        //   linkSupport: true,
        // },
        // implementation: {
        //   dynamicRegistration: true,
        //   linkSupport: true,
        // },
        // references: { dynamicRegistration: true },
        // documentHighlight: { dynamicRegistration: true },
        // documentSymbol: {
        //   dynamicRegistration: true,
        //   hierarchicalDocumentSymbolSupport: true,
        // },
        codeAction: { dynamicRegistration: true },
        // codeLens: {},
        // documentLink: {
        //   dynamicRegistration: true,
        //   tooltipSupport: false,
        // },
        // colorProvider: {},
        formatting: { dynamicRegistration: true },
        // rangeFormatting: {},
        // onTypeFormatting: {},
        rename: { dynamicRegistration: true },
        // foldingRange: {},
        // selectionRange: {},
        publishDiagnostics: {
          versionSupport: true,
          codeDescriptionSupport: true,
          relatedInformation: true,
          tagSupport: { valueSet: [DiagnosticTag.Unnecessary, DiagnosticTag.Deprecated] },
        },
        moniker: {},
      },
      workspace: {
        didChangeConfiguration: { dynamicRegistration: true },
        didChangeWatchedFiles: { dynamicRegistration: true },
      },
    },
    processId: null,
    rootUri: rootURI,
    workspaceFolders: null,
  })

  conn.initialized().catch(e => console.error(e))
  return results
}

export async function startLS({
  rootURI,
  connectionString,
}: {
  connectionString: string
  rootURI: string
}) {
  const ws = new WebSocket(connectionString)

  const connection = await createMessageConnection(ws)
  connection.listen()

  const lsp = createLSPConnection(connection)
  const { capabilities } = await initialize(lsp, rootURI)

  return {
    lsp,
    capabilities,
  }
}
