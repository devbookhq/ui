import { shell } from '@codemirror/legacy-modes/mode/shell'
import { go } from '@codemirror/legacy-modes/mode/go'
import { python } from '@codemirror/legacy-modes/mode/python'
import { typescript } from '@codemirror/legacy-modes/mode/javascript'
import { StreamLanguage } from '@codemirror/stream-parser'

import type { Language } from '../../hooks/usePublishedCodeSnippet'

const shellLanguage = StreamLanguage.define(shell)
const goLanguage = StreamLanguage.define(go)
const typescriptLanguage = StreamLanguage.define(typescript)
const pythonLanguage = StreamLanguage.define(python)

export function getLanguageHighlight(lang: Language) {
  switch (lang) {
    case 'Bash':
      return shellLanguage
    case 'Go':
      return goLanguage
    case 'Nodejs':
      return typescriptLanguage
    case 'Python3':
      return pythonLanguage
    case 'Typescript':
      return typescriptLanguage
    default:
      return typescriptLanguage
  }
}
