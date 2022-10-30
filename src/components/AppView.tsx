import { UI } from 'components/AppEditor/uiComponents'

import { RootState } from 'core/EditorProvider/models/RootStoreProvider'
import ViewProvider from 'core/ViewProvider'

export interface Props {
  state: RootState
}

function AppView({ state }: Props) {
  return (
    <ViewProvider initialState={state}>
      <div className="relative flex flex-1 bg-white">
        {Object.values(state.board.blocks).map(b => (
          <UI.ViewBoardBlock
            key={b.id}
            {...b}
          />
        ))}
      </div>
    </ViewProvider>
  )
}

export default AppView
