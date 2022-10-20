import { SessionProvider } from '@devbookhq/react'

import { UI } from 'components/AppEditor/uiComponents'

import { App } from 'utils/queries/types'

export interface Props {
  app: App
}

function AppView({ app }: Props) {
  return (
    <SessionProvider
      opts={{
        codeSnippetID: 'Mh3XS5Pq9ch8',
      }}
    >
      <div className="relative flex flex-1">
        {Object.values(app.state.board.blocks).map(b => (
          <UI.PreviewBoardBlock
            key={b.id}
            {...b}
          />
        ))}
      </div>
    </SessionProvider>
  )
}

export default AppView
