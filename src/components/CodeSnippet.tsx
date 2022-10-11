import { CodeSnippetExecState } from '@devbookhq/sdk'
import React, { useEffect, useState } from 'react'

import usePublishedCodeSnippet, { Language } from '../hooks/usePublishedCodeSnippet'
import { CodeSnippetExtendedState } from '../hooks/useRunCode'
import useRunCode from '../hooks/useRunCode'
import { useProvidedSession } from '../utils/SessionProvider'
import CodeEditor from './CodeEditor'
import CopyButton from './CopyButton'
import Output from './Output'
import RunButton from './RunButton'
import Spinner from './icons/Spinner'

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

  const session = useProvidedSession()

  const codeSnippet = usePublishedCodeSnippet({
    codeSnippetID: id,
    connectCodeSnippetIDs: connectIDs,
  })

  const [initCode, setInitCode] = useState(
    codeSnippet?.codeSnippetCode || fallbackContent || '',
  )
  const [code, setCode] = useState(initCode)

  useEffect(
    function reinitializeCode() {
      if (!codeSnippet) return
      setInitCode(codeSnippet.codeSnippetCode)
      setCode(codeSnippet.codeSnippetCode)
    },
    [codeSnippet],
  )

  const {
    run: runCS,
    stop: onStopClick,
    state: csState,
    output: csOutput,
  } = useRunCode(session)

  async function onRunClick() {
    if (!codeSnippet) return

    setHasRan(true)

    const codeToRun = `${codeSnippet.codeSnippetConnectCode}\n${code}`

    return runCS(codeToRun, codeSnippet.codeSnippetEnvVars)
  }

  function handleCopyButtonClick() {
    navigator.clipboard.writeText(code)
  }

  return (
    <div
      className="
      dbk-code-editor
      flex
      flex-col
      overflow-hidden
      rounded-lg
      border
      border-black-700
      bg-black-700
    "
    >
      <div
        className="
        flex
        flex-row-reverse
        items-center
        justify-between
        bg-black-700
        py-1
        px-2
      "
      >
        <CopyButton onClick={handleCopyButtonClick} />
        {id && (hasRan || csState !== CodeSnippetExtendedState.Loading) && (
          <div className="flex items-center justify-center space-x-1">
            <RunButton
              state={csState}
              onRunClick={onRunClick}
              onStopClick={onStopClick}
            />
            {csState === CodeSnippetExecState.Running && <Spinner></Spinner>}
          </div>
        )}
      </div>
      <CodeEditor
        content={initCode}
        isReadOnly={!isEditable}
        language={codeSnippet?.codeSnippetTemplate || fallbackLanguage}
        onContentChange={setCode}
      />
      {id && (
        <Output
          hasRan={hasRan}
          output={csOutput}
          state={csState}
          onRunClick={onRunClick}
          onStopClick={onStopClick}
        />
      )}
    </div>
  )
}

export default CodeSnippet
