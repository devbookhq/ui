import {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useCallback,
  useImperativeHandle,
} from 'react'
import {
  EnvVars,
} from '@devbookhq/sdk'

import type { Handler as InputHandler } from 'components/Input'
import Title from 'components/typography/Title'
import EnvVariable from './EnvVariable'

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

const EnvVariables = forwardRef<InputHandler, Props>(({
  envVars,
  onEnvVarsChange,
}, ref) => {
  const [envVarsList, setEnvVarsList] = useState<EnvVarItem[]>([])

  const inputRef = useRef<HTMLInputElement>(null)
  const focus = useCallback(() => inputRef.current?.focus(), [inputRef])

  useImperativeHandle(ref, () => ({
    focus,
  }), [
    focus,
  ])

  useEffect(function init() {
    const newList = getEnvVarItems(envVars)
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

  function addEnvVar(key: string, value: string = '') {
    const newList = [...envVarsList, { key, value }]

    setEnvVarsList(newList)
    handleSaveEnvVars(newList)


    setTimeout(() => focus())
    focus()
  }

  function deleteEnvVar(index: number) {
    const newList = envVarsList.filter((_, i) => i !== index)

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
      <div
        className="
          w-full
          flex
          flex-col
          items-start
          justify-center
          space-y-4
        ">
        <Title
          title="Manage environment variables"
          size={Title.size.T2}
        />
        {envVarsList.map(({ key, value }, i) => (
          <EnvVariable
            key={i}
            onDelete={() => deleteEnvVar(i)}
            varKey={key}
            varValue={value}
            onVarKeyChange={(key) => changeEnvVarKey(i, key)}
            onVarValueChange={(value) => changeEnvVarValue(i, value)}
          />
        ))}
        <EnvVariable
          ref={inputRef}
          onAdd={addEnvVar}
        />
      </div>
    </div>
  )
})

EnvVariables.displayName = 'EnvVariables'

export default EnvVariables
