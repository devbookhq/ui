import '../styles/index.css'

export { default as useExternalLanguageServer } from './hooks/useLanguageServer/useExternalLanguageServer'
export { default as useLanguageServerClients } from './hooks/useLanguageServer/useLanguageServerClients'
export { default as useLanguageServerProcess } from './hooks/useLanguageServer/useLanguageServerProcess'
export { default as CodeEditor } from './components/CodeEditor'
export { default as useLanguageServer } from './hooks/useLanguageServer'
export { getFileURI, getRootURI } from './hooks/useLanguageServer/utils'
export { getLanguageSetup } from './hooks/useLanguageServer/setup'
export { LanguageServerClient } from './hooks/useLanguageServer/languageServerClient'
export { LanguageServerPlugin } from './hooks/useLanguageServer/languageServerPlugin'
export { LanguageServerProcess } from './hooks/useLanguageServer/languageServerProcess'

export type { LSClients } from './hooks/useLanguageServer/useLanguageServerClients'
export type { Handler as CodeEditorHandler, ExtendedCMDiagnostic, Props as CodeEditorProps } from './components/CodeEditor'
export type { LanguageSetup, ServerCapabilities } from './hooks/useLanguageServer/setup'
