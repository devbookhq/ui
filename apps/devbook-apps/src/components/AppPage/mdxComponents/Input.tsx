import Select from 'components/Select'
import { ReactNode, useEffect, useState } from 'react'
import { useAppContext } from '../AppContext'

export interface Props {
  children: ReactNode
  values?: string[]
  entry: string
}

function getValue(target: string) {
  return {
    key: target,
    title: target,
  }
}

function Input({
  children,
  values = [],
  entry,
}: Props) {
  const [appCtx, setAppCtx] = useAppContext()
  useEffect(function attach() {
    if (values && values?.length > 0) {
      setAppCtx(d => {
        d.state[entry] = values[0]
      })
    }
  }, [entry, values])

  const target = appCtx.state[entry]

  function changeCode(newTarget: string) {
    appCtx.Code.changeContent?.(code =>
      code.replace(`${target}`, `${newTarget}`)
    )

    setAppCtx(d => {
      d.state[entry] = newTarget
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
        onChange={(v) => { changeCode(v.key) }}
        direction="left"
        selectedValue={getValue(children as string || target || '')}
        values={values.map(getValue)}
      />
    </div>
  )
}

export default Input
