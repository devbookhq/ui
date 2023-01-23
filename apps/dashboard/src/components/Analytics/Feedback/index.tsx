import { useMemo } from 'react'

import useAppFeedback from 'hooks/useAppFeedback'
import { getFeedData, aggregateGuidesFeedback } from 'utils/analytics'
import { App } from 'queries/types'
import Text from 'components/typography/Text'
import Spinner from 'components/icons/Spinner'

import FeedbackFeed from './Feed'

export interface Props {
  app: App
}

function Feedback({ app }: Props) {
  const { feedback, isLoading, error } = useAppFeedback(app.devbook_app_id)
  const [guidesFeedback, feed] = useMemo(() => {
    const feedbackByGuide = aggregateGuidesFeedback(feedback)
    const feed = getFeedData(feedbackByGuide)
    return [feedbackByGuide, feed]
  }, [feedback])




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
            <div className="absolute bottom-0 mb-[-13px] w-full rounded-t border-b-2 transition-all border-green-400" />
          </div>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden justify-center mt-0.5 px-4">
        {!isLoading && !error && <FeedbackFeed feed={feed} />}
        {isLoading && <Spinner className="self-center" />}
      </div>
    </div>
  )
}

export default Feedback
