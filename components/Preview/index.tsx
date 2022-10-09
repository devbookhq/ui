import { SharedSessionProvider } from '@devbookhq/react'

import { ItemMap, useBoardItems } from 'components/Editor/Board/Container'
import { renderPreviewItem } from 'components/Editor/UIComponent'

export interface Props {
  serializedApp: object
}

function Preview({ serializedApp }: Props) {
  const [items] = useBoardItems(serializedApp as ItemMap)

  return (
    <SharedSessionProvider
      opts={{
        codeSnippetID: 'Mh3XS5Pq9ch8',
      }}
    >
      <div className="relative flex flex-1">
        {Object.values(items).map(item => renderPreviewItem(item))}
      </div>
    </SharedSessionProvider>
  )
}

export default Preview
