import { observer } from 'mobx-react-lite'

import Text from 'components/typography/Text'

import { useRootStore } from 'core/EditorProvider/models/RootStoreProvider'

function EnvTab() {
  const { resources } = useRootStore()

  return (
    <div className="flex flex-col items-start justify-start space-y-1 px-1">
      <Text
        className="flex w-12 whitespace-nowrap text-slate-400"
        size={Text.size.T2}
        text="Environment ID"
      />
      <Text
        className="flex w-12 whitespace-nowrap text-slate-600"
        size={Text.size.T2}
        text={resources.environmentID || 'undefined'}
      />
    </div>
  )
}

export default observer(EnvTab)
