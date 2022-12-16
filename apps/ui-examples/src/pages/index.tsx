import { LanguageSetup, useExternalLanguageServer, useLanguageServerClients, ServerCapabilities } from '@devbookhq/code-editor'
import { IRawGrammar, useTextMateLanguages } from '@devbookhq/codemirror-textmate'
import { useSession } from '@devbookhq/react'
import { Terminal } from '@devbookhq/terminal'
import React, { useCallback, useMemo } from 'react'
import { sql as sqlLanguage } from '@codemirror/lang-sql'

import prismaTextMate from '../grammars/prisma.tmLanguage.json'

import { typescriptLanguage } from '@codemirror/lang-javascript'

// import prismaInitializeRequest from '../defaultCapabilities/prisma.json'
import typescriptInitializeRequest from '../defaultCapabilities/typescript.json'

const textMateGrammars: IRawGrammar[] = [prismaTextMate as unknown as IRawGrammar]

const rootdir = '/code'

const cmd = 'lsp-ws-proxy -l 5523 -- typescript-language-server --stdio -- prisma-language-server --stdio'

export const supportedLanguages: LanguageSetup[] = [
  {
    // Necessary packages were installed by `npm i -g typescript-language-server typescript`
    languageServerCommand: 'typescript-language-server',
    fileExtensions: ['.js', '.ts'],
    languageID: 'typescript',
    languageExtensions: typescriptLanguage,
    defaultServerCapabilities: typescriptInitializeRequest.result.capabilities as ServerCapabilities,
  },
  {
    // Necessary packages were installed by `npm i -g @prisma/language-server`
    languageServerCommand: 'prisma-language-server',
    fileExtensions: ['.prisma'],
    languageID: 'prisma',
    // defaultServerCapabilities: prismaInitializeRequest.result.capabilities as ServerCapabilities,
  },
  {
    fileExtensions: ['.sql'],
    languageID: 'sql',
    languageExtensions: sqlLanguage(),
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

function Index() {
  const session = useSession({
    codeSnippetID: 'acprvBflDsD6',
    inactivityTimeout: 0,
    // editEnabled: true,
    // apiKey: '',
  })

  const languages = useSupportedLangaugesWithTextMate()

  // const languageClients = useLanguageServer({
  //   supportedLanguages,
  //   session: session.session,
  //   debug: true,
  //   rootdir: '/code',
  // })

  const server = useExternalLanguageServer({
    supportedLanguages,
    session: session.session,
    port: 5523,
  })

  const languageClients = useLanguageServerClients({
    server,
    rootdir,
  })


  const handleRun = useCallback(() => {
    console.log('run', session.session?.getHostname())
  }, [session.session])

  const handleLine = useCallback((line: string) => {
    console.log({ line })
  }, [])

  const handleCopy = useCallback((content: string) => {
    console.log({ content })
  }, [])

  return (
    <div className="">
      <div className="cursor-pointer bg-gray-50" onClick={session.refresh}>{session.state}</div>
      <div className="flex h-[300px]">
        <Terminal
          canStartTerminalSession={true}
          session={session.session}
          placeholder="place"
          onLine={handleLine}
          onCopy={handleCopy}
          isPersistent
        />
      </div>
      {/* <CodeEditor
        content={ts}
        filename="/code/index.sql"
        languageClients={languageClients}
        supportedLanguages={languages}
        handleRun={handleRun}
      />
      <CodeEditor
        theme={oneDark}
        className='h-[500px]'
        content={prisma}
        filename="/code/prisma/schema.prisma"
        languageClients={languageClients}
        supportedLanguages={languages}
      /> */}
    </div>
  )
}

export default Index
