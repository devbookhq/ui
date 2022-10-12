import { SessionProvider } from '@devbookhq/react'

import { renderPreviewItem } from 'components/Editor/UIComponent'
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
          {app.serialized.blocks?.map(item => renderPreviewItem(item))}
        </div>
      </SessionProvider>
      <SwitchMode className="fixed top-4 right-4" />
    </>
  )
}

export default Preview
