import Text from 'components/typography/Text'
import Select from 'components/Select'
import { FeedEntry, GuideFeedback } from 'utils/analytics'

import Message from './Message'
import FeedDivider from './FeedDivider'
import { useRouter } from 'next/router'

export interface Props {
  feed: FeedEntry[]
  guides: GuideFeedback[]
}

function FeedbackFeed({ feed, guides }: Props) {
  const router = useRouter()
  const queryFilter = router.query.guide as string

  function changeFilter(guideID?: string) {
    router.query.guide = guideID
    router.push({
      pathname: router.pathname,
      query: router.query,
    }, undefined, {
      shallow: true,
    })
  }

  const filteredFeedback = queryFilter ? feed.filter(f => f.guide?.id === queryFilter) : feed

  const todayFeedback = filteredFeedback.filter(f => f.isFromToday)
  const yesterdayFeedback = filteredFeedback.filter(f => f.isFromYesterday)
  const olderFeedback = filteredFeedback.filter(f => !f.isFromYesterday && !f.isFromToday)

  const defaultGuide = feed.length > 0 ? feed[0].guide?.title : undefined
  const queryGuideTitle = feed.find(f => f.guide?.id === queryFilter)?.guide?.title

  return (
    <div className="flex-col overflow-hidden flex flex-1 justify-center max-w-[800px]">
      <div className="md:left-3 md:top-3 absolute shadow md:shadow-none rounded bottom-4 right-3">
        <Select
          items={[{
            label: 'All',
            value: undefined as any,
          }, ...guides.map(g => ({
            value: g,
            label: g.title,
          })).sort((a, b) => {
            return a.label.localeCompare(b.label)
          })]}
          onSelect={(i) => {
            console.log({ i })
            changeFilter(i?.value?.id)
          }}
          selectedItemLabel={queryGuideTitle || defaultGuide}
        />
      </div>
      <div className="
    flex
      flex-col
      scroller
      flex-1
      z-10
      overflow-auto
      space-y-4
      max-w-[800px]
      min-w-[300px]
      pb-20
      pt-4
      px-4
      "
      >
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
    </div>
  )
}

export default FeedbackFeed
