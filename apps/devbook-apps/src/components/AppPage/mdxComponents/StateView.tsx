import { useAppContext } from '../AppContext'

export interface Props {
  entry: string
}

function StateView({ entry }: Props) {
  const [appCtx] = useAppContext()

  const value = appCtx.state[entry]
  return (
    <>
      {value !== undefined &&
        <strong className="">
          {value}
        </strong>
      }
    </>
  )
}

export default StateView
