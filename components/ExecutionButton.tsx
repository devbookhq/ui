import Button from 'components/Button'
import PlayCircleIcon from 'components/icons/PlayCircle'
import StopIcon from 'components/icons/Stop'
import SpinnerIcon from 'components/icons/Spinner'

export enum ExecutionState {
  Running,
  Stopped,
  Loading,
}

interface Props {
  className?: string
  state: ExecutionState
  onClick: (e: any) => void
  isDisabled?: boolean
}

function ExecutionButton({
  className,
  state,
  onClick,
  isDisabled,
}: Props) {
  let text = 'Loading...'
  let icon = <SpinnerIcon />

  switch (state) {
    case ExecutionState.Stopped:
      text = 'Run'
      icon = (
        <PlayCircleIcon className="
          text-green-500
        "/>
      )
    break
    case ExecutionState.Running:
      text = 'Stop'
      icon = <StopIcon/>
    break
    case ExecutionState.Loading:
      text = 'Loading...'
      icon = <SpinnerIcon/>
    break
  }

  return (
    <Button
      className={className}
      isDisabled={isDisabled}
      text={text}
      onClick={onClick}
      icon={icon}
    />
  )
}

export default ExecutionButton
