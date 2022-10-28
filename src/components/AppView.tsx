import { SessionProvider } from '@devbookhq/react'

import { UI } from 'components/AppEditor/uiComponents'

import { RootState } from 'core/EditorProvider/models/RootStoreProvider'

export interface Props {
  state: RootState
}

function AppView({ state }: Props) {
  return (
    <SessionProvider
      opts={{
        codeSnippetID: state.resources.environmentID,
      }}
    >
      <div className="relative flex flex-1 bg-white">
        {Object.values(state.board.blocks).map(b => (
          <UI.ViewBoardBlock
            key={b.id}
            {...b}
          />
        ))}
      </div>
    </SessionProvider>
  )
}

export default AppView
