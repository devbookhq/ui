import { CodeSnippetExecState } from '@devbookhq/sdk'
import React from 'react'

import { CodeSnippetExtendedState, CodeSnippetState } from '../hooks/useRunCode'
import Button from './Button'
import PlayIcon from './icons/Play'
import SpinnerIcon from './icons/Spinner'
import StopIcon from './icons/Stop'

interface Props {
  className?: string
  state: CodeSnippetState
  onRunClick?: () => void
  onStopClick?: () => void
  textLeft?: string
}

function RunButton({ className, state, textLeft, onRunClick, onStopClick }: Props) {
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
      icon={icon}
      isDisabled={state === CodeSnippetExtendedState.Loading}
      textLeft={textLeft}
      textRight={text}
      onClick={handleClick}
    />
  )
}

export default RunButton
