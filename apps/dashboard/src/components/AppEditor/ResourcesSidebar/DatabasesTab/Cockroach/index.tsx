import clsx from 'clsx'
import { observer } from 'mobx-react-lite'

import Input from 'components/Input'
import Toggle from 'components/Toggle'
import Text from 'components/typography/Text'

import { useRootStore } from 'core/EditorProvider/models/RootStoreProvider'

import CockroachDB from './CockroachDB'

function Cockroach() {
  const { resources } = useRootStore()
  return (
    <div
      className={clsx(
        'flex flex-1 flex-col space-y-2 rounded border py-2 transition-all',
        {
          'border-green-300 shadow-sm': resources.cockroachDB?.enabled,
          'border-slate-100 hover:border-slate-200': !resources.cockroachDB?.enabled,
        },
      )}
    >
      <div className="flex flex-1 items-center justify-between py-1 px-3">
        <Text
          text="CockroachDB"
          className="text-slate-600"
          icon={<CockroachDB />}
        />
        <Toggle
          enabled={!!resources.cockroachDB?.enabled}
          onChange={e =>
            resources.setCockroachDB({
              enabled: e,
              cached: true,
              url: undefined,
              outputStringFormat: 'DATABASE_URL=${{URL}}',
              outputFile: '/code/.env',
            })
          }
        />
      </div>

      {resources.cockroachDB?.enabled && (
        <div className="flex flex-1 flex-col space-y-4 border-t border-slate-100 p-3 transition-all">
          <div className="flex flex-1 flex-col space-y-1">
            <Text
              className="mr-12 flex w-12 whitespace-nowrap text-slate-400"
              size={Text.size.S3}
              text="Save connection string to a file"
            />
            <Input
              placeholder="Save connection string here"
              value={resources.cockroachDB?.outputFile || ''}
              onChange={e => resources.cockroachDB?.setOutputFile(e.target.value)}
            />
          </div>
          <div className="flex flex-1 flex-col space-y-1">
            <Text
              className="mr-12 flex w-12 whitespace-nowrap text-slate-400"
              size={Text.size.S3}
              text="Save connection string in a format"
            />
            <Input
              placeholder="DATABASE_URL=${{URL}}"
              value={resources.cockroachDB?.outputStringFormat || ''}
              onChange={e => resources.cockroachDB?.setOutputStringFormat(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default observer(Cockroach)
