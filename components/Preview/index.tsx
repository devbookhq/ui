import { SharedSessionProvider } from '@devbookhq/react'
import { useBoardItems } from 'components/Editor/Board/Container'
import { renderBoardItem, renderPreviewItem } from 'components/Editor/UIComponent'

export interface Props {

}

function Preview({ }: Props) {
  const [items] = useBoardItems(
    {
      'ui_omJGSYgH2N76kVRYuxpXu': {
        'left': 200,
        'top': 140,
        'id': 'ui_omJGSYgH2N76kVRYuxpXu',
        'componentType': 'CodeSnippet'
      },
      'ui_mAOwL0roE7_napNVsltRc': {
        'left': 200,
        'top': 350,
        'id': 'ui_mAOwL0roE7_napNVsltRc',
        'componentType': 'CodeSnippet'
      },
      'ui_c5lVksg85sSXFWSXDqbrr': {
        'left': 610,
        'top': 140,
        'id': 'ui_c5lVksg85sSXFWSXDqbrr',
        'componentType': 'Placeholder'
      }
    }
  )

  return (
    <SharedSessionProvider opts={{ codeSnippetID: 'Mh3XS5Pq9ch8' }}>
      <div className="relative flex flex-1">
        {Object.values(items).map((item) => renderPreviewItem(item))}
      </div>
    </SharedSessionProvider>
  )
}

export default Preview
