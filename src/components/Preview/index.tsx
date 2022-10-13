import { SessionProvider } from '@devbookhq/react'

import { renderPreviewBoardBlock } from 'components/Editor/uiComponents'
import SwitchMode from 'components/SwitchMode'

import { App } from 'utils/queries/types'

export interface Props {
  app: App
}

function Preview({ app }: Props) {
  return (
    <>
      <SessionProvider
        opts={{
          codeSnippetID: 'Mh3XS5Pq9ch8',
        }}
      >
        <div className="relative flex flex-1">
          {Object.values(app.state.board.blocks).map(b => renderPreviewBoardBlock(b))}
        </div>
      </SessionProvider>
      <SwitchMode className="fixed top-4 right-4" />
    </>
  )
}

export default Preview
