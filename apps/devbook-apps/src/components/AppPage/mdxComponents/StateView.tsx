import { useAppContext } from '../AppContext'

export interface Props {
  entry: string
  transform?: { [key: string]: string }
}

function StateView({ entry, transform }: Props) {
  const [appCtx] = useAppContext()

  const value = appCtx.state[entry]
  return (
    <>
      {value !== undefined &&
        <strong className="text-brand-500">
          {transform ? transform[value] : value}
        </strong>
      }
    </>
  )
}

export default StateView
