import { LanguageSetup } from '@devbookhq/code-editor'
import { javascript } from '@codemirror/lang-javascript'
import { json } from '@codemirror/lang-json'
import { markdown } from '@codemirror/lang-markdown'

export enum LanguageID {
  TypeScript = 'typescript',
  Json = 'json',
  Markdown = 'markdown',
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
  {
    languageID: LanguageID.Markdown,
    fileExtensions: ['.md', '.mdx'],
    languageExtensions: markdown(),
  },
]
