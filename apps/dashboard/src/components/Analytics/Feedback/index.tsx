import { useMemo } from 'react'

import useAppFeedback from 'hooks/useAppFeedback'
import { getFeedData, aggregateGuidesFeedback } from 'utils/analytics'
import { App } from 'queries/types'
import Text from 'components/typography/Text'

import GuidesFeedback from './GuidesFeedback'
import Tabs from 'components/Tabs'
import FeedbackFeed from './Feed'
import Spinner from 'components/icons/Spinner'

export interface Props {
  app: App
}

function Feedback({ app }: Props) {
  const { feedback, isLoading } = useAppFeedback(app.devbook_app_id)
  const [guidesFeedback, feed] = useMemo(() => {
    const feedbackByGuide = aggregateGuidesFeedback(feedback)
    const feed = getFeedData(feedbackByGuide)
    return [feedbackByGuide, feed]
  }, [feedback])

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="pt-4 pb-3 px-6 flex justify-between flex-col ">
        <Text text={app.title} size={Text.size.S1} />
      </div>
      <div className="overflow-hidden">
        {isLoading && <Spinner className="m-auto" />}
        {!isLoading &&
          <Tabs
            labelSize={Text.size.S2}
            className="px-6"
            defaultValue="guides"
            tabs={[
              {
                component: <GuidesFeedback guidesFeedback={guidesFeedback} />,
                label: 'Guides',
                value: 'guides'
              },
              {
                component: <FeedbackFeed feed={feed} />,
                label: 'Timeline',
                value: 'feed'
              },
            ]}
          />
        }
      </div>
    </div>
  )
}

export default Feedback
