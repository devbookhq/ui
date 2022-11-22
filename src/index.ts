import '../styles/index.css'

export { default as CodeEditor } from './components/CodeEditor'
export { default as useLanguageServer, defaultLanguages } from './hooks/useLanguageServer'

export type { LanguageSetup, LSClients } from './hooks/useLanguageServer'
