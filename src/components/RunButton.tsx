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
  className = `dbk-run-btn dbk-button ${className}`

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
  }

  function handleClick(e: any) {
    if (state === CodeSnippetExecState.Stopped) onRunClick(e)
    if (state === CodeSnippetExecState.Running) onStopClick(e)
  }

  return (
    <Button
      className={className}
      isDisabled={state === CodeSnippetExtendedState.Loading}
      text={text}
      onClick={handleClick}
      icon={icon}
    />
  )
}

export default RunButton