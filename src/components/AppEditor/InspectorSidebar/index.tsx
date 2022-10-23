import { observer } from 'mobx-react-lite'

import Sidebar from 'components/Sidebar'

import { useRootStore } from 'core/EditorProvider/models/RootStoreProvider'

import AppInspector from './AppInspector'
import BlockInspector from './BlockInspector'

function InspectorSidebar() {
  const { board } = useRootStore()

  const selectedBlock = board.selectedBlock

  return (
    <Sidebar
      className="flex flex-col items-stretch"
      side={Sidebar.side.Right}
    >
      {selectedBlock && <BlockInspector block={selectedBlock} />}
      {!selectedBlock && <AppInspector />}
    </Sidebar>
  )
}

export default observer(InspectorSidebar)
