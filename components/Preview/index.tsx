import { SessionProvider } from '@devbookhq/react'

import { ItemMap, useBoardBlocks } from 'components/BuilderProvider/useBoardBlocks'
import { renderPreviewItem } from 'components/Editor/UIComponent'
import SwitchMode from 'components/SwitchMode'

export interface Props {
  serializedApp: object
}

function Preview({ serializedApp }: Props) {
  const [items] = useBoardBlocks(serializedApp as ItemMap)

  return (
    <>
      <SessionProvider
        opts={{
          codeSnippetID: 'Mh3XS5Pq9ch8',
        }}
      >
        <div className="relative flex flex-1">
          {Object.values(items).map(item => renderPreviewItem(item))}
        </div>
      </SessionProvider>
      <SwitchMode className="fixed top-4 right-4" />
    </>
  )
}

export default Preview
