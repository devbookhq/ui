import {
  useState,
  useRef,
} from 'react'
import { useRouter } from 'next/router'
import Splitter, { SplitDirection } from '@devbookhq/splitter'
import type { EnvVars } from '@devbookhq/sdk'
import type { Language } from 'types'

import { Tab } from 'utils/newCodeSnippetTabs'
import CodeEditor from 'components/CodeEditor'
import EditIcon from 'components/icons/Edit'
import Output from 'components/Output'
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

  const session = useSharedSession()
  if (!session) throw new Error('Undefined session but it should be defined. Are you missing SessionContext in parent component?')

  return (
    <div className="flex flex-1">
      <div
        style={{ display: tab === Tab.Code ? 'flex' : 'none' }}
        className="flex-1"
      >
        <Code
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
          language={language}
        />
      </div>
      <div
        style={{ display: tab === Tab.Env ? 'flex' : 'none' }}
        className="flex-1"
      >
        <EnvVariables
          envVars={envVars}
          onEnvVarsChange={onEnvVarsChange}
        />
      </div>
    </div >
  )
}

export default CSEditorContent
