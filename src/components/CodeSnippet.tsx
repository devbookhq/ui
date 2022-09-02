import React, {
  useEffect,
  useState,
} from 'react'
import { CodeSnippetExecState } from '@devbookhq/sdk'

import usePublishedCodeSnippet, { Language } from '../hooks/usePublishedCodeSnippet'
import { CodeSnippetExtendedState } from '../hooks/useRunCode'
import CodeEditor from './CodeEditor'
import Output from './Output'
import RunButton from './RunButton'
import CopyButton from './CopyButton'
import Spinner from './icons/Spinner'
import useSharedSession from '../utils/SharedSessionProvider'
import useRunCode from '../hooks/useRunCode'

export interface Props {
  id?: string
  connectIDs?: string[]
  isEditable?: boolean
  fallbackContent?: string
  fallbackLanguage?: Language
}

function CodeSnippet({
  id,
  connectIDs,
  isEditable,
  fallbackContent,
  fallbackLanguage = 'Typescript',
}: Props) {
  const [hasRan, setHasRan] = useState(false)

  const sharedSession = useSharedSession()

  const codeSnippet = usePublishedCodeSnippet({
    codeSnippetID: id,
    connectCodeSnippetIDs: connectIDs,
  })

  const [initCode, setInitCode] = useState(codeSnippet?.codeSnippetCode || fallbackContent || '')
  const [code, setCode] = useState(initCode)

  useEffect(function reinitializeCode() {
    if (!codeSnippet) return
    setInitCode(codeSnippet.codeSnippetCode)
    setCode(codeSnippet.codeSnippetCode)
  }, [codeSnippet])

  const {
    run: runCS,
    stop: onStopClick,
    state: csState,
    output: csOutput,
  } = useRunCode(sharedSession)

  async function onRunClick() {
    if (!codeSnippet) return

    setHasRan(true)

    const codeToRun = `${codeSnippet.codeSnippetConnectCode}\n${code}`

    return runCS(
      codeToRun,
      codeSnippet.codeSnippetEnvVars,
    )
  }

  function handleCopyButtonClick() {
    navigator.clipboard.writeText(code)
  }

  return (
    <div className="
      dbk-code-snippet
      flex
      flex-col
      overflow-hidden
      border
      border-black-700
      rounded-lg
      dbk-code-editor
    ">
      <div className="
        dbk-header
        flex
        flex-row-reverse
        items-center
        justify-between
        py-1
        px-2
        rounded-t-lg
        bg-black-700
      ">
        <CopyButton
          onClick={handleCopyButtonClick}
        />
        {id && (hasRan || csState !== CodeSnippetExtendedState.Loading) &&
          <div className="items-center justify-center flex space-x-1">
            <RunButton
              onRunClick={onRunClick}
              onStopClick={onStopClick}
              state={csState}
            />
            {csState === CodeSnippetExecState.Running &&
              <Spinner></Spinner>
            }
          </div>
        }
      </div>
      <CodeEditor
        isReadOnly={!isEditable}
        language={codeSnippet?.codeSnippetTemplate || fallbackLanguage}
        content={initCode}
        onContentChange={setCode}
      />
      {id &&
        <Output
          state={csState}
          hasRan={hasRan}
          onStopClick={onStopClick}
          onRunClick={onRunClick}
          output={csOutput}
        />
      }
    </div>
  )
}

export default CodeSnippet
