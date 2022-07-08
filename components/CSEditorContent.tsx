import {
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { useRouter } from 'next/router'
import type { EnvVars } from '@devbookhq/sdk'

import type { Language } from 'types'
import type { Handler as CodeEditorHandler } from 'components/CodeEditor'
import type { Handler as TerminalHandler } from 'components/Terminal'
import type { Handler as InputHandler } from 'components/Input'
import { Tab } from 'utils/newCodeSnippetTabs'
import useSharedSession from 'utils/useSharedSession'
import EnvVariables from './EnvVariables'
import Deps from './Deps'
import Code from './Code'


export interface Props {
  code: string
  envVars: EnvVars
  title: string
  language: Language
  onEnvVarsChange: (envVars: EnvVars) => void
  onCodeChange: (code: string) => void
  onTitleChange: (title: string) => void
}

function CSEditorContent({
  code,
  title,
  envVars,
  language,
  onCodeChange,
  onTitleChange,
  onEnvVarsChange,
}: Props) {
  const router = useRouter()
  const tab = router.query.tab

  const [termInitialized, setTermInitialized] = useState(false)

  const codeEditorRef = useRef<CodeEditorHandler>(null)
  const terminalRef = useRef<TerminalHandler>(null)
  const emptyEnvRef = useRef<InputHandler>(null)

  const session = useSharedSession()
  if (!session) throw new Error('Undefined session but it should be defined. Are you missing SessionContext in parent component?')

  useLayoutEffect(function autofocus() {
    switch (tab) {
      case Tab.Code:
        codeEditorRef.current?.focus()
        break
      case Tab.Deps:
        setTermInitialized(true)
        terminalRef.current?.focus()
        break
      case Tab.Env:
        emptyEnvRef.current?.focus()
        break
    }
  }, [tab])

  return (
    <div className="flex flex-1">
      <div
        style={{ display: tab === Tab.Code ? 'flex' : 'none' }}
        className="flex-1"
      >
        <Code
          ref={codeEditorRef}
          language={language}
          onTitleChange={onTitleChange}
          onCodeChange={onCodeChange}
          title={title}
          code={code}
        />
      </div>
      <div
        style={{ display: tab === Tab.Deps ? 'flex' : 'none' }}
        className="flex-1"
      >
        <Deps
          initialized={termInitialized}
          ref={terminalRef}
          language={language}
        />
      </div>
      <div
        style={{ display: tab === Tab.Env ? 'flex' : 'none' }}
        className="flex-1"
      >
        <EnvVariables
          ref={emptyEnvRef}
          envVars={envVars}
          onEnvVarsChange={onEnvVarsChange}
        />
      </div>
    </div >
  )
}

export default CSEditorContent
