import { Registry } from 'vscode-textmate'
import {
  createOnigScanner,
  createOnigString,
  loadWASM,
} from 'vscode-oniguruma'

export async function initializeTextMateRegistry() {
  // @ts-ignore
  const wasmModule = await import('vscode-oniguruma/release/onig.wasm')
  const response = await fetch(wasmModule.default)
  const arrayBuffer = await response.arrayBuffer()

  await loadWASM(arrayBuffer)

  return new Registry({
    onigLib: Promise.resolve({
      createOnigScanner,
      createOnigString,
    }),
    // We don't want to cache raw grammars here
    async loadGrammar() {
      return null
    },
  })
}
