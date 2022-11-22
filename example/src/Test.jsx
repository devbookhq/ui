import { CodeEditor, defaultLanguages, useLanguageServer } from '@devbookhq/code-editor'
import { useProvidedSession } from '@devbookhq/react'
import React from 'react'

function Test() {
  const s = useProvidedSession()

  const languageClients = useLanguageServer({
    supportedLanguages: defaultLanguages,
    session: s.session,
    debug: true,
    rootdir: '/code',
  })

  return (
    <div>
      <CodeEditor
        content="xxxxxxxxxxxxxxxxxxxxxxxx\n\n"
        filename="/code/index.js"
        languageClients={languageClients}
        supportedLanguages={defaultLanguages}
      />
    </div>
  )
}

export default Test
