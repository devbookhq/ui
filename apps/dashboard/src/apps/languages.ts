import { LanguageSetup } from '@devbookhq/code-editor'
import { javascript } from '@codemirror/lang-javascript'
import { json } from '@codemirror/lang-json'

export enum LanguageID {
  TypeScript = 'typescript',
  Json = 'json',
}

export const supportedLanguages: LanguageSetup[] = [
  {
    languageID: LanguageID.TypeScript,
    fileExtensions: ['.js', '.ts'],
    languageExtensions: javascript({ typescript: true }),
  },
  {
    languageID: LanguageID.Json,
    fileExtensions: ['.json'],
    languageExtensions: json(),
  },
]
