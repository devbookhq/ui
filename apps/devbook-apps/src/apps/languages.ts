import { LanguageSetup, ServerCapabilities } from '@devbookhq/code-editor'
import { javascript } from '@codemirror/lang-javascript'
import { json } from '@codemirror/lang-json'

import typescriptDefaultServerCapabilities from './languageServerCapabilities/typescript.json'

export enum LanguageID {
  TypeScript = 'typescript',
  Json = 'json',
}

export const supportedLanguages: LanguageSetup[] = [
  {
    languageID: LanguageID.TypeScript,
    fileExtensions: ['.js', '.ts'],
    languageExtensions: javascript({ typescript: true }),
    defaultServerCapabilities: typescriptDefaultServerCapabilities.result.capabilities as ServerCapabilities,
    languageServerCommand: 'typescript-language-server',
  },
  {
    languageID: LanguageID.Json,
    fileExtensions: ['.json'],
    languageExtensions: json(),
  },
]
