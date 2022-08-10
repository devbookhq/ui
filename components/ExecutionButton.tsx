import { CodeSnippetExecState } from '@devbookhq/sdk'
import { ReactNode } from 'react'
import cn from 'classnames'
import { PlayIcon, StopIcon } from '@radix-ui/react-icons'

import Button from 'components/Button'
import SpinnerIcon from 'components/icons/Spinner'
import { CodeSnippetState, CodeSnippetExtendedState } from 'utils/useSession'

interface Props {
  className?: string
  state: CodeSnippetState
  onRunClick: (e: any) => void
  onStopClick: (e: any) => void
}

function ExecutionButton({
  className,
  state,
  onRunClick,
  onStopClick,
}: Props) {
  let text = 'Loading...'
  let icon: ReactNode = <SpinnerIcon />

  switch (state) {
    case CodeSnippetExecState.Stopped:
      text = 'Run'
      icon = (
        <PlayIcon className="
          text-green-500
        "/>
      )
      break
    case CodeSnippetExecState.Running:
      text = 'Stop'
      icon = <StopIcon />
      break
    case CodeSnippetExtendedState.Loading:
      text = 'Loading...'
      icon = <SpinnerIcon />
      break
    case CodeSnippetExtendedState.Failed:
      icon = null
      text = 'Error'
      break
  }

  function handleClick(e: any) {
    if (state === CodeSnippetExecState.Stopped) onRunClick(e)
    if (state === CodeSnippetExecState.Running) onStopClick(e)
  }

  return (
    <Button
      className={cn(className, { 'text-red-400': state === CodeSnippetExtendedState.Failed })}
      isDisabled={state === CodeSnippetExtendedState.Loading || state === CodeSnippetExtendedState.Failed}
      text={text}
      onClick={handleClick}
      icon={icon}
    />
  )
}

export default ExecutionButton
