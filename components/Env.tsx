import {
  useEffect,
  useState,
} from 'react'
import cn from 'classnames'
import {
  EnvVars,
} from '@devbookhq/sdk'

import useSharedSession from 'utils/useSharedSession'
import { showErrorNotif } from 'utils/notification'
import Title from 'components/typography/Title'
import Button from 'components/Button'
import Output from 'components/Output'
import SpinnerIcon from 'components/icons/Spinner'
import CheckIcon from 'components/icons/Check'
import CancelIcon from 'components/icons/Cancel'

interface EnvVarItem {
  key: string
  value: string
}

export interface Props {
  envVars?: EnvVars
  onEnvVarsChange: (envVars: EnvVars) => void
}

function getEnvVarItems(vars: EnvVars): EnvVarItem[] {
  return Object.entries(vars).map(([key, value]) => ({ key, value }))
}

function getEnvVarsMap(items: EnvVarItem[]): EnvVars {
  return items.reduce<EnvVars>((prev, curr) => {
    prev[curr.key] = curr.value
    return prev
  }, {})
}

function Env({
  envVars: initEnvVars = {},
  onEnvVarsChange,
}: Props) {
  const [envVarsList, setEnvVarsList] = useState<EnvVarItem[]>(() => getEnvVarItems(initEnvVars))

  function handleSaveEnvVars() {
    const vars = getEnvVarsMap(envVarsList)
    onEnvVarsChange(vars)
  }

  function changeEnvVarValue(index: number, value: string) {
    setEnvVarsList(e => {
      e[index].value = value
      return [...e]
    })
  }

  function changeEnvVarKey(index: number, key: string) {
    setEnvVarsList(e => {
      e[index].key = key
      return [...e]
    })
  }

  function addEnvVar() {
    setEnvVarsList(e => [...e, { key: '', value: '' }])
  }

  function deleteEnvVar(index: number) {
    setEnvVarsList(e => e.filter((_, i) => i === index))
  }

  return (
    <div className="
      flex-1
      flex
      flex-col
      items-start
      space-y-4
    ">
      <Title
        title="Environment"
        size={Title.size.T2}
      />

      <div className="
        w-full
        flex
        flex-col
        items-start
        space-y-8
      ">
        <div className="
          w-full
          flex
          flex-col
          items-start
          justify-center
          space-y-4
        ">
          <Title
            title="Environment variables"
            size={Title.size.T2}
          />
          {!envVars && (
            <div className="
              w-full
              flex
              items-center
              justify-center
            ">
              <SpinnerIcon />
            </div>
          )}
          {envVars && Object.entries(envVars).map(([key, value]) => (
            <div
              key={key}
              className="
                pb-2
                w-full
                flex
                flex-row-reverse
                border-b
                border-black-700
                hover:border-green-200
                group
              "
            >
              <span className="
                w-full
                font-mono
                peer-hover:text-green-200
                group-hover:text-green-200
              ">
                {key}
              </span>
              <span className="
                w-full
                font-mono
                peer-hover:text-green-200
                group-hover:text-green-200
              ">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Env
