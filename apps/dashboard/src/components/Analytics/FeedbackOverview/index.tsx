import { useMemo } from 'react'

import useAppFeedback from 'hooks/useAppFeedback'
import { formatGuidesFeedback, GuideFeedback, UserRating, UserMessage } from 'utils/analytics'
import { App as FeedbackOverview } from 'queries/types'
import Text from 'components/typography/Text'
import Spinner from 'components/icons/Spinner'
import FeedbackFeed from './FeedbackFeed'

export interface Props {
  app: FeedbackOverview
}

const hourInMs = 60 * 60 * 1000

export interface FeedMessage extends UserMessage {
  guide: GuideFeedback
  isFromYesterday: boolean
  isFromToday: boolean
}

export interface FeedRating extends UserRating {
  guide: GuideFeedback
  isFromYesterday: boolean
  isFromToday: boolean
}

export type FeedEntry = FeedMessage | FeedRating

function formatFeedData(feedback: GuideFeedback[]): FeedEntry[] {
  const timeNow = new Date().getTime()

  const feed = feedback.flatMap(g => {
    const messages = g.feed.map(m => {
      const isFromToday = (timeNow - m.timestamp.getTime()) / hourInMs < 24
      const isFromYesterday = !isFromToday && (timeNow - m.timestamp.getTime()) / hourInMs < 48
      return {
        guide: g,
        ...m,
        isFromToday,
        isFromYesterday,
      }
    })
    return messages
  })

  feed.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

  return feed
}

function FeedbackOverview({ app }: Props) {
  const { feedback, isLoading, error } = useAppFeedback(app.devbook_app_id)
  const guidesFeedback = useMemo(() => formatGuidesFeedback(feedback), [feedback])

  const feedData = useMemo(() => formatFeedData(guidesFeedback), [guidesFeedback])

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="pt-4 pb-3 px-6 flex justify-between flex-col space-y-4 border-b">
        <Text text={app.title} size={Text.size.S1} />
        <div className="flex space-x-4">
          <div className="relative">
            <Text
              className="transition-all text-green-800"
              size={Text.size.S2}
              text="User Feedback"
            />
            <div className="absolute bottom-0 mb-[-13px] w-full rounded-t border-b-2 transition-all border-green-400"></div>
          </div>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden justify-center mt-0.5 px-4">
        {!isLoading && !error && <FeedbackFeed feed={feedData} />}
        {isLoading && <Spinner className="self-center" />}
      </div>
    </div>
  )
}

export default FeedbackOverview
