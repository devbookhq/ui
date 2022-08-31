import React from 'react'
import { CodeSnippetExecState } from '@devbookhq/sdk'

import PlayIcon from './icons/Play'
import StopIcon from './icons/Stop'
import SpinnerIcon from './icons/Spinner'
import Button from './Button'

import {
  CodeSnippetState,
  CodeSnippetExtendedState,
} from '../hooks/useSession'

interface Props {
  className?: string
  state: CodeSnippetState
  onRunClick: (e: any) => void
  onStopClick: (e: any) => void
}

function RunButton({
  className,
  state,
  onRunClick,
  onStopClick,
}: Props) {
  const stateClass = state === CodeSnippetExtendedState.Failed ? 'text-red-400' : ''
  className = `dbk-run-btn ${className} ${stateClass}`

  let text = 'Loading...'
  let icon: JSX.Element | undefined = <SpinnerIcon />

  switch (state) {
    case CodeSnippetExecState.Stopped:
      text = 'Run'
      icon = <PlayIcon className="text-green-500" />
      break
    case CodeSnippetExecState.Running:
      text = 'Stop'
      icon = <StopIcon className="text-red-500" />
      break
    case CodeSnippetExtendedState.Loading:
      text = ''
      icon = <SpinnerIcon />
      break
    case CodeSnippetExtendedState.Failed:
      icon = undefined
      text = 'Error'
      break
  }

  function handleClick(e: any) {
    if (state === CodeSnippetExecState.Stopped) onRunClick(e)
    if (state === CodeSnippetExecState.Running) onStopClick(e)
  }


  return (
    <Button
      className={className}
      isDisabled={state === CodeSnippetExtendedState.Loading || state === CodeSnippetExtendedState.Failed}
      text={text}
      onClick={handleClick}
      icon={icon}
    />
  )
}

export default RunButton