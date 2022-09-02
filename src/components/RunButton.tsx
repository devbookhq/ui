import React from 'react'
import { CodeSnippetExecState } from '@devbookhq/sdk'

import PlayIcon from './icons/Play'
import StopIcon from './icons/Stop'
import SpinnerIcon from './icons/Spinner'
import Button from './Button'

import {
  CodeSnippetState,
  CodeSnippetExtendedState,
} from '../hooks/useRunCode'

interface Props {
  className?: string
  state: CodeSnippetState
  onRunClick?: () => void
  onStopClick?: () => void
  textLeft?: string
}

function RunButton({
  className,
  state,
  textLeft,
  onRunClick,
  onStopClick,
}: Props) {
  className = `dbk-run-btn ${className}`

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

  function handleClick() {
    if (state === CodeSnippetExecState.Stopped) onRunClick?.()
    if (state === CodeSnippetExecState.Running) onStopClick?.()
  }

  return (
    <Button
      className={className}
      isDisabled={state === CodeSnippetExtendedState.Loading}
      textRight={text}
      textLeft={textLeft}
      onClick={handleClick}
      icon={icon}
    />
  )
}

export default RunButton