import { useLanguageServer, LanguageSetup, CodeEditor, CodeEditorHandler } from '@devbookhq/code-editor'
import { IRawGrammar, useTextMateLanguages } from '@devbookhq/codemirror-textmate'
import { typescriptLanguage } from '@codemirror/lang-javascript'
import { useSharedSession } from '@devbookhq/react'
import { Terminal } from '@devbookhq/terminal'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

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
  const s = useSharedSession()

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

  const [isHidden, setIsHidden] = useState(false)

  useEffect(() => {
    const ina = setInterval(() => {
      setIsHidden(s => !s)
    }, 4000)

    return () => {
      clearInterval(ina)
    }
  }, [ref])

  return (
    <div className="bg-yellow-200">
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
        handleRun={() => console.log('run')}
        supportedLanguages={languages}
      />
      <div className="flex h-[300px]">
        <Terminal
          canStartTerminalSession={true}
          session={s.session}
          isHidden={isHidden}
          onRunningCmdChange={() => { }}
        />
      </div>
    </div>
  )
}

export default Test
