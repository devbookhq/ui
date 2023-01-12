import { observer } from 'mobx-react-lite'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import Button from 'components/Button'
import Input from 'components/Input'
import Text from 'components/typography/Text'

import { useRootStore } from 'core/EditorProvider/models/RootStoreProvider'

function EnvTab() {
  const { resources } = useRootStore()

  const [envID, setEnvID] = useState(resources.environmentID)

  useEffect(
    function setEnv() {
      setEnvID(resources.environmentID)
    },
    [resources.environmentID],
  )

  return (
    <div className="flex min-h-0 flex-1 flex-col items-start justify-between space-y-4 px-1">
      <div className="flex flex-1 flex-col space-y-1">
        <Text
          className="flex w-12 whitespace-nowrap text-slate-400"
          size={Text.size.S3}
          text="Environment ID"
        />
        <Input
          value={envID || ''}
          onChange={e => setEnvID(e.target.value)}
        />
      </div>
      <div className="flex items-center justify-start space-x-1">
        <Link
          rel="noopener noreferrer"
          target="_blank"
          href={`https://dash.usedevbook.com/${resources.environmentID}/edit`}
        >
          <Button text="Edit env" />
        </Link>
        {envID !== resources.environmentID && (
          <Button
            text="Confirm env change"
            variant={Button.variant.Full}
            onClick={() => resources.setEnvironmentID(envID)}
          />
        )}
      </div>
    </div>
  )
}

export default observer(EnvTab)
