import { useLanguageServer, LanguageSetup, CodeEditor, CodeEditorHandler } from '@devbookhq/code-editor'
import { IRawGrammar, useTextMateLanguages } from '@devbookhq/codemirror-textmate'
import { typescriptLanguage } from '@codemirror/lang-javascript'
import { useProvidedSession } from '@devbookhq/react'
import { Terminal } from '@devbookhq/terminal'
import React, { useCallback, useMemo, useRef } from 'react'

import prismaTextMate from '../grammars/prisma.tmLanguage.json'
import { prisma, ts } from '../grammars/examples'

const textMateGrammars: IRawGrammar[] = [prismaTextMate as unknown as IRawGrammar]

export const supportedLanguages: LanguageSetup[] = [
  {
    // Necessary packages were installed by `npm i -g typescript-language-server typescript`
    languageServerCommand: 'typescript-language-server',
    fileExtensions: ['.js', '.ts'],
    languageID: 'typescript',
    languageExtensions: typescriptLanguage,
  },
  {
    // Necessary packages were installed by `npm i -g typescript-language-server typescript`
    languageServerCommand: 'prisma-language-server',
    fileExtensions: ['.prisma'],
    languageID: 'prisma',
  },
]

export function useSupportedLangaugesWithTextMate() {
  const textMateLanguages = useTextMateLanguages({ textMateGrammars })

  const languages = useMemo(() => {
    if (!textMateLanguages) return supportedLanguages

    return supportedLanguages.map(s => {
      if (s.languageExtensions) return s

      const languageExtensions = textMateLanguages[`source.${s.languageID}`]
      if (!languageExtensions) return s


      return {
        ...s,
        languageExtensions,
      }
    })
  }, [textMateLanguages])

  return languages
}

function Test() {
  const s = useProvidedSession()

  const languages = useSupportedLangaugesWithTextMate()

  const languageClients = useLanguageServer({
    supportedLanguages: languages,
    session: s.session,
    debug: true,
    rootdir: '/code',
  })

  const ref = useRef<CodeEditorHandler>(null)

  const onDiagnosticsChange = useCallback((d: any) => {
    console.log('ch')
  }, [])

  // useEffect(() => {
  //   if (!ref.current) return

  //   const ina = setInterval(() => {
  //     const ds = ref.current?.getDiagnostics()
  //     console.log('getds', ds)
  //   }, 4000)


  //   return () => {
  //     clearInterval(ina)
  //   }
  // }, [ref])



  return (
    <div style={{ backgroundColor: 'gold', height: '700px' }}>
      <CodeEditor
        content={ts}
        filename="/code/index.ts"
        languageClients={languageClients}
        supportedLanguages={languages}
      />
      <CodeEditor
        ref={ref}
        // onDiagnosticsChange={onDiagnosticsChange}
        content={prisma}
        onContentChange={onDiagnosticsChange}
        filename="/code/prisma/schema.prisma"
        languageClients={languageClients}
        supportedLanguages={languages}
      />
      <Terminal
        canStartTerminalSession={true}
        session={s.session}
        onRunningCmdChange={() => { }}
      />
    </div>
  )
}

export default Test
