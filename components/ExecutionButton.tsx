import Button from 'components/Button'
import PlayCircleIcon from 'components/icons/PlayCircle'
import StopIcon from 'components/icons/Stop'
import SpinnerIcon from 'components/icons/Spinner'
import { CodeSnippetExecState } from '@devbookhq/sdk'

interface Props {
  className?: string
  state: CodeSnippetExecState
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
  let icon = <SpinnerIcon />

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
      icon = <StopIcon/>
    break
    case CodeSnippetExecState.Loading:
      text = 'Loading...'
      icon = <SpinnerIcon/>
    break
  }

  function handleClick(e: any) {
    if (state === CodeSnippetExecState.Stopped) onRunClick(e)
    if (state === CodeSnippetExecState.Running) onStopClick(e)
  }

  return (
    <Button
      className={className}
      isDisabled={state === CodeSnippetExecState.Loading}
      text={text}
      onClick={handleClick}
      icon={icon}
    />
  )
}

export default ExecutionButton
