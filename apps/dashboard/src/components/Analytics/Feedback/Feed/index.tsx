import Text from 'components/typography/Text'
import { FeedEntry } from 'utils/analytics'

import Message from './Message'
import FeedDivider from './FeedDivider'

export interface Props {
  feed: FeedEntry[]
}

function FeedbackFeed({ feed }: Props) {
  const todayFeedback = feed.filter(f => f.isFromToday)
  const yesterdayFeedback = feed.filter(f => f.isFromYesterday)
  const olderFeedback = feed.filter(f => !f.isFromYesterday && !f.isFromToday)

  return (
    <div className="
      flex
      flex-col
      scroller
      flex-1
      overflow-auto
      space-y-4
      max-w-[800px]
      min-w-[300px]
      pb-20
      pt-4
      px-4
    ">
      <FeedDivider text={`Last day (${todayFeedback.length})`} />
      {todayFeedback.map(f => (
        <Message message={f} key={f.timestamp.toString()} />
      ))}
      {todayFeedback.length == 0 && <Text text="No messages yet" className="text-slate-400 self-center py-2" />}
      {yesterdayFeedback.length > 0 && <FeedDivider text={`Yesterday (${yesterdayFeedback.length})`} />}
      {yesterdayFeedback.map(f => (
        <Message message={f} key={f.timestamp.toString()} />
      ))}
      {olderFeedback.length > 0 && <FeedDivider text={`Older (${olderFeedback.length})`} />}
      {olderFeedback.map(f => (
        <Message message={f} key={f.timestamp.toString()} />
      ))}
    </div>
  )
}

export default FeedbackFeed
