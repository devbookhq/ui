import { CodeSnippetExecState } from '@devbookhq/sdk'
import { ReactNode } from 'react'
import cn from 'classnames'

import Button from 'components/Button'
import PlayCircleIcon from 'components/icons/PlayCircle'
import StopIcon from 'components/icons/Stop'
import SpinnerIcon from 'components/icons/Spinner'
import { SessionState } from 'utils/useSession'

interface Props {
  className?: string
  state: CodeSnippetExecState
  onRunClick: (e: any) => void
  onStopClick: (e: any) => void
  sessionState: SessionState
}

function ExecutionButton({
  className,
  state,
  sessionState,
  onRunClick,
  onStopClick,
}: Props) {
  let text = 'Loading...'
  let icon: ReactNode = <SpinnerIcon />

  switch (state) {
    case CodeSnippetExecState.Stopped:
      text = 'Run'
      icon = (
        <PlayCircleIcon className="
          text-green-500
        "/>
      )
      break
    case CodeSnippetExecState.Running:
      text = 'Stop'
      icon = <StopIcon />
      break
    case CodeSnippetExecState.Loading:
      text = 'Loading...'
      icon = <SpinnerIcon />
      break
  }

  const sessionError = sessionState === 'closed' && state !== CodeSnippetExecState.Loading

  if (sessionError) {
    icon = null
    text = 'Error'
  }

  function handleClick(e: any) {
    if (state === CodeSnippetExecState.Stopped) onRunClick(e)
    if (state === CodeSnippetExecState.Running) onStopClick(e)
  }

  return (
    <Button
      className={cn(className, { 'text-red-400': sessionError })}
      isDisabled={state === CodeSnippetExecState.Loading || sessionState === 'closed'}
      text={text}
      onClick={handleClick}
      icon={icon}
    />
  )
}

export default ExecutionButton
