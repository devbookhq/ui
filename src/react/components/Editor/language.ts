import {
  typescriptLanguage,
  javascriptLanguage,
  jsxLanguage,
  tsxLanguage,
} from '@codemirror/lang-javascript'
import { shell } from '@codemirror/legacy-modes/mode/shell'
import { StreamLanguage } from '@codemirror/stream-parser'

const shellLanguage = StreamLanguage.define(shell)

export enum Language {
  'sh' = 'sh',
  'jsx' = 'jsx',
  'js' = 'js',
  'tsx' = 'tsx',
  'ts' = 'ts',
}

export function getLanguageExtension(lang?: Language) {
  switch (lang) {
    case Language.js:
      return javascriptLanguage
    case Language.jsx:
      return jsxLanguage
    case Language.ts:
      return typescriptLanguage
    case Language.tsx:
      return tsxLanguage
    case Language.sh:
      return shellLanguage
    default:
      return typescriptLanguage
  }
}
