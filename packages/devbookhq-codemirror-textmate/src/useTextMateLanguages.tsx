import { StreamLanguage } from '@codemirror/language'
import {
  useEffect,
  useState,
} from 'react'

import {
  IRawGrammar,
  ParserState,
  createLanguage,
} from './parser'
import useTextMateRegistry from './useTextMateRegistry'

export interface Opts {
  /**
   * This object should not change on rerender. Don't initialize the array inside of the component function.
   */
  textMateGrammars: IRawGrammar[]
}

export function useTextMateLanguages({ textMateGrammars }: Opts) {
  const [languages, setLanguages] = useState<{ languages: { [scopeName: string]: StreamLanguage<ParserState>}, id?: {} }>({ languages: {} })

  const registry = useTextMateRegistry()

  useEffect(function createLanguageParsers() {
    if (!registry) return

    setLanguages({
      id: registry,
      languages: {},
    })

    textMateGrammars.forEach(async textMate => {
      const reg = await registry
      const grammar = await reg.addGrammar(textMate)
      const language = createLanguage(textMate.scopeName, grammar)

      setLanguages(l => l.id === registry ? {
        ...l,
        languages: {
          ...l.languages,
          [textMate.scopeName]: language,
        },
      }: l)
    })

    return () => {
      setLanguages(l => l.id === registry ? { languages: {} } : l)
    }

  }, [registry, textMateGrammars])

  return languages.languages
}
