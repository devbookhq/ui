import { ReactNode } from 'react'
import { useAppContext } from '../AppContext'
import RunButton from '../RunButton'
import StopButton from '../StopButton'

export interface Props {
  children: ReactNode
  line?: number
}

function Run({
}: Props) {
  const [appCtx] = useAppContext()

  return (
    <div className="inline-flex mr-1">
      {!appCtx.Code.isRunning ? (
        <RunButton
          onClick={() => appCtx.Code.run?.()}
        />
      ) : (
        <StopButton
          onClick={() => appCtx.Code.stop?.()}
        />
      )}
    </div>
  )
}

export default Run
