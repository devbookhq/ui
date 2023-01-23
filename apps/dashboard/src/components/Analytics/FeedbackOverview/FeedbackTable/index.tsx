import Text from 'components/typography/Text'
import { GuideFeedback } from 'utils/analytics'
import GuideOverview from './GuideOverview'

export interface Props {
  guides: GuideFeedback[]
}

function FeedbackTable({ guides }: Props) {
  return (
    <div className="flex flex-1 flex-col rounded">
      <div className="py-2 px-1 bg-slate-100 border-b rounded-t">
        <Text text="Guides" />
      </div>
      <div className="flex flex-col flex-1 scroller overflow-auto space-y-4 bg-white">
        {guides.map(g => (
          <GuideOverview guide={g} key={g.id} />
        ))}
      </div>
    </div>
  )
}

export default FeedbackTable
