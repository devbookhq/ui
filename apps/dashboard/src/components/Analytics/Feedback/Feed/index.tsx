import Text from 'components/typography/Text'
import Select from 'components/Select'
import { FeedEntry, GuideFeedback } from 'analytics'

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
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        guide: guideID,
      },
    }, undefined, {
      shallow: true,
    })
  }

  const filteredFeedback = queryFilter ? feed.filter(f => f.guide?.id === queryFilter) : feed

  const todayFeedback = filteredFeedback.filter(f => f.isFromToday)
  const yesterdayFeedback = filteredFeedback.filter(f => f.isFromYesterday)
  const olderFeedback = filteredFeedback.filter(f => !f.isFromYesterday && !f.isFromToday)

  const defaultGuide = 'All guides'
  const queryGuideTitle = feed.find(f => f.guide?.id === queryFilter)?.guide?.title

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col bg-white border-b">
        <div
          className="
              space-x-1
              md:w-[800px]
              md:self-center
              py-1
              px-4
              justify-end
              flex-1
              flex
            ">
          <Text
            text="Feedback from"
            size={Text.size.S3}
            className="text-slate-400"
          />
          <Select
            items={[{
              label: 'All guides',
              value: undefined,
            }, ...guides.map(g => ({
              value: g,
              label: g.title,
            })).sort((a, b) => {
              return a.label.localeCompare(b.label)
            })]}
            onSelect={(i) => {
              changeFilter(i?.value?.id)
            }}
            selectedItemLabel={queryGuideTitle || defaultGuide}
          />
        </div>
      </div>
      <div className="
          flex
          md:w-[800px]
          md:self-center
          flex-col
          scroller
          flex-1
          overflow-auto
          space-y-3
          pb-20
          pt-4

          "
      >
        <FeedDivider text={`Last day (${todayFeedback.length})`} />
        {todayFeedback.map(f => (
          <Message message={f} key={f.timestamp.toString()} />
        ))}
        {todayFeedback.length == 0 &&
          <Text
            text="No messages yet"
            className="text-slate-400 self-center py-2"
          />
        }
        {yesterdayFeedback.length > 0 &&
          <FeedDivider text={`Yesterday (${yesterdayFeedback.length})`} />
        }
        {yesterdayFeedback.map(f => (
          <Message
            message={f}
            key={f.timestamp.toString()}
          />
        ))}
        {olderFeedback.length > 0 &&
          <FeedDivider
            text={`Older (${olderFeedback.length})`}
          />}
        {olderFeedback.map(f => (
          <Message
            message={f}
            key={f.timestamp.toString()}
          />
        ))}
      </div>
    </div>
  )
}

export default FeedbackFeed
