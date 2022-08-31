import React, { useState } from 'react'

import usePublishedCodeSnippet, { Language } from '../hooks/usePublishedCodeSnippet'
import useSession, { CodeSnippetExtendedState } from '../hooks/useSession'
import CodeEditor from './CodeEditor'
import Output from './Output'
import RunButton from './RunButton'
import CopyButton from './CopyButton'

export interface Props {
  id: string
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

  const codeSnippet = usePublishedCodeSnippet({
    codeSnippetID: id,
    connectCodeSnippetIDs: connectIDs,
  })

  const {
    csOutput,
    csState,
    runCS,
    stopCS: onStopClick,
  } = useSession({
    codeSnippetID: id,
    debug: true,
  })

  async function onRunClick() {
    if (!codeSnippet) return

    setHasRan(true)
    return runCS(
      codeSnippet.codeSnippetRunCode,
      codeSnippet.codeSnippetEnvVars,
    )
  }

  function handleCopyButtonClick() {
    const content = codeSnippet?.codeSnippetEditorCode || fallbackContent || ''
    navigator.clipboard.writeText(content)
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
          <RunButton
            onRunClick={onRunClick}
            onStopClick={onStopClick}
            state={csState}
          />
        }
      </div>
      <CodeEditor
        isReadOnly={!isEditable}
        language={codeSnippet?.codeSnippetTemplate || fallbackLanguage}
        content={codeSnippet?.codeSnippetEditorCode || fallbackContent}
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
