import {
  useEffect,
  useState,
  memo,
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
import Input from './Input'

interface EnvVarItem {
  key: string
  value: string
}

export interface Props {
  envVars: EnvVars
  onEnvVarsChange: (envVars: EnvVars) => void
}

function getEnvVarItems(vars: EnvVars): EnvVarItem[] {
  return Object.entries(vars).map(([key, value]) => ({ key, value }))
}

function getEnvVarsMap(items: EnvVarItem[]): EnvVars {
  return items.reduce<EnvVars>((prev, curr) => {
    if (curr.key.length > 0) {
      prev[curr.key] = curr.value
    }
    return prev
  }, {})
}

function Env({
  envVars,
  onEnvVarsChange,
}: Props) {
  const [envVarsList, setEnvVarsList] = useState<EnvVarItem[]>([])

  useEffect(function init() {
    const newList = getEnvVarItems(envVars)
    if (newList.length === 0) {
      newList.push({ key: '', value: '' })
    }
    setEnvVarsList(newList)
  }, [])

  function handleSaveEnvVars(items: EnvVarItem[]) {
    const vars = getEnvVarsMap(items)
    onEnvVarsChange(vars)
  }

  function changeEnvVarValue(index: number, value: string) {
    envVarsList[index].value = value
    const newList = [...envVarsList]
    setEnvVarsList(newList)
    handleSaveEnvVars(newList)
  }

  function changeEnvVarKey(index: number, key: string) {
    envVarsList[index].key = key
    const newList = [...envVarsList]
    setEnvVarsList(newList)
    handleSaveEnvVars(newList)
  }

  function addEnvVar() {
    const newList = [...envVarsList, { key: '', value: '' }]
    setEnvVarsList(newList)
  }

  function deleteEnvVar(index: number) {
    const newList = envVarsList.filter((_, i) => i !== index)
    if (newList.length === 0) {
      newList.push({ key: '', value: '' })
    }
    setEnvVarsList(newList)
    handleSaveEnvVars(newList)
  }

  return (
    <div className="
      flex-1
      flex
      flex-col
      items-start
    ">
      <div className="
          w-full
          flex
          flex-col
          items-start
          justify-center
          space-y-4
        ">
        <div className="flex space-x-4 items-center pb-4">
          <Title
            title="Environment variables"
            size={Title.size.T2}
          />
          <Button
            text="Add"
            onClick={addEnvVar}
          />
        </div>
        {envVarsList.map(({ key, value }, i) => (
          <div
            key={i}
            className="
                w-full
                flex
                flex-1
                items-center
              "
          >
            <div
              className="flex space-x-2 pr-4"
            >
              <Title
                className="text-gray-500"
                title="Name"
                size={Title.size.T3}
              />
              <Input
                value={key}
                onChange={(e) => changeEnvVarKey(i, e.target.value)}
              />
            </div>
            <div
              className="flex space-x-2 pr-2"
            >
              <Title
                className="text-gray-500"
                title="Value"
                size={Title.size.T3}
              />
              <Input
                value={value}
                onChange={(e) => changeEnvVarValue(i, e.target.value)}
              />
            </div>
            <div
              onClick={() => deleteEnvVar(i)}
              className="text-black-700 cursor-pointer hover:text-red-400"
            >
              <CancelIcon
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Env
