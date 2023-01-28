import { useMemo } from 'react'
import clsx from 'clsx'
import { useRouter } from 'next/router'

import useAppFeedback from 'hooks/useAppFeedback'
import { getFeedData, aggregateGuidesFeedback } from 'analytics'
import { App } from 'queries/db'
import Text from 'components/typography/Text'
import Spinner from 'components/icons/Spinner'
import HeaderLink from 'components/Header/Navigation/HeaderLink'

import GuidesOverview from './GuidesOverview'
import FeedbackFeed from './Feed'

export interface Props {
  app: App
}

const views = [
  {
    label: 'Overview',
    value: '',
  },
  {
    label: 'User Feedback',
    value: 'feedback',
  }
]

function Feedback({ app }: Props) {
  const { feedback, isLoading } = useAppFeedback(app.devbook_app_id)
  const [guidesFeedback, feed] = useMemo(() => {
    const feedbackByGuide = aggregateGuidesFeedback(feedback)
    const feed = getFeedData(feedbackByGuide)
    return [feedbackByGuide, feed]
  }, [feedback])

  const router = useRouter()
  const view = router.query.view || ''

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="pt-3 flex space-y-2 justify-between flex-col bg-white">
        <Text text={app.title} size={Text.size.S1} className="px-4" />
        <div
          className={clsx('flex border-b border-slate-200 px-4 space-x-2')}
        >
          {views.map(v => (
            <HeaderLink
              active={v.value === view}
              key={v.label}
              title={v.label}
              href={{
                pathname: router.pathname,
                query: {
                  ...router.query,
                  view: v.value,
                },
              }}
              shallow
            />
          ))}
        </div>
      </div>
      <div className="overflow-hidden justify-center flex flex-1">
        {isLoading && <Spinner className="m-auto" />}
        {!isLoading &&
          <>
            {!view && <GuidesOverview guides={guidesFeedback} />}
            {view === 'feedback' && <FeedbackFeed feed={feed} guides={guidesFeedback} />}
          </>
        }
      </div>
    </div>
  )
}

export default Feedback
