import { javascriptLanguage } from '@codemirror/lang-javascript'
import { pythonLanguage } from '@codemirror/lang-python'
import { shell } from '@codemirror/legacy-modes/mode/shell'
import { go } from '@codemirror/legacy-modes/mode/go'
import { StreamLanguage } from '@codemirror/stream-parser'
import type { Language } from 'types'

const shellLanguage = StreamLanguage.define(shell)
const goLanguage = StreamLanguage.define(go)

export function getLanguageExtension(lang: Language) {
  switch (lang) {
    case 'Bash':
      return shellLanguage
    case 'Go':
      return goLanguage
    case 'Nodejs':
      return javascriptLanguage
    case 'Typescript':
      return javascriptLanguage
    case 'Python3':
      return pythonLanguage
    default:
      return javascriptLanguage
  }
}
