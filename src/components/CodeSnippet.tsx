import React from 'react'

import usePublishedCodeSnippet from '../hooks/usePublishedCodeSnippet'
import useSession from '../hooks/useSession'
import CodeEditor from './CodeEditor'
import Output from './Output'
import RunButton from './RunButton'
import CopyButton from './CopyButton'

export interface Props {
  id: string
  insertIDs?: string[]
}

function CodeSnippet({
  id,
  insertIDs,
}: Props) {
  const codeSnippet = usePublishedCodeSnippet({
    codeSnippetID: id,
    insertedCodeSnippetIDs: insertIDs,
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

    return runCS(
      codeSnippet.codeSnippetRunCode,
      codeSnippet.codeSnippetEnvVars,
    )
  }

  function handleCopyButtonClick() {
    if (!codeSnippet) return

    navigator.clipboard.writeText(codeSnippet.codeSnippetEditorCode)
  }

  return (
    <div className="
      dbk-code-snippet
      flex
      flex-1
      flex-col
      overflow-hidden
      border
      border-black-700
      rounded-lg
    ">
      <div className="
        dbk-header
        flex
        flex-row
        items-center
        justify-between
        py-1
        px-2
        rounded-t-lg
        bg-black-700
      ">
        <RunButton
          onRunClick={onRunClick}
          onStopClick={onStopClick}
          state={csState}
        />
        <CopyButton
          onClick={handleCopyButtonClick}
        />
      </div>
      <CodeEditor
        isReadOnly={true}
        language={codeSnippet?.codeSnippetTemplate || 'Nodejs'}
        content={codeSnippet?.codeSnippetEditorCode}
        className="absolute inset-0"
      />
      <Output
        output={csOutput}
      />
    </div>
  )
}

export default CodeSnippet
