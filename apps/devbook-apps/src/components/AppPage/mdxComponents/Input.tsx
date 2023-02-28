import Select from 'components/Select'
import { ReactNode, useEffect, useState } from 'react'
import { useAppContext } from '../AppContext'

export interface Props {
  children: ReactNode
  line?: number
  value?: string
}

const targets = ['US', 'FR', 'CA']

function getUsername(target: string) {
  return `yourUsername-country-${target}`
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
      <div
        className="
        border-green-500
        inline-flex
        group
        transition-all
        group-hover:border-green-600
        border-b-4
      "
      >
        <Select
          label=""
          onChange={(v) => { changeCode(v.key) }}
          direction="left"
          selectedValue={getValue(target || value)}
          values={targets.map(getValue)}
        />
      </div>
    </div>
  )
}

export default Input
