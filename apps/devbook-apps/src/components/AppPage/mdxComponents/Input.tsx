import Select from 'components/Select'
import { ReactNode, useEffect } from 'react'
import { useAppContext } from '../AppContext'

export interface Props {
  children: ReactNode
  line?: number
  value?: string
}

const targets = ['US', 'FR', 'CA']

function getUsername(target: string) {
  return `${target}`
}

function getValue(target: string) {
  return {
    key: target,
    title: getUsername(target),
  }
}

const key = 'target'

function Input({
  children,
  line,
  value = 'US',
}: Props) {
  const [appCtx, setAppCtx] = useAppContext()
  useEffect(function attach() {
    setAppCtx(d => {
      d.state[key] = value
    })
  }, [value])
  const target = appCtx.state[key]

  function changeCode(newTarget: string) {
    // TODO: Make this hardcoded replacement general
    appCtx.Code.changeContent?.(code =>
      code
        .replace(`\'${getUsername(target || value)}\'`, `\'${getUsername(newTarget)}\'`)
    )

    setAppCtx(d => {
      d.state[key] = newTarget
    })

    appCtx.Code.run?.()
  }

  return (
    <div className="
    group
    inline-flex
    cursor-pointer
    ">
      <Select
        label=""
        onChange={(v) => { changeCode(v.key) }}
        direction="left"
        selectedValue={getValue(children as string || target || value)}
        values={targets.map(getValue)}
      />
    </div>
  )
}

export default Input
