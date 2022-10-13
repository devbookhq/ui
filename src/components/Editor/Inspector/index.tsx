import { observer } from 'mobx-react-lite'

import { useRootStore } from 'core/BuilderProvider/models/RootStoreProvider'

function Inspector() {
  const { board } = useRootStore()

  if (!board.selectedBlock) return null

  return (
    <div className="flex border-t border-black-700">
      INSPECTOR-{board.selectedBlock.id}
    </div>
  )
}

export default observer(Inspector)
