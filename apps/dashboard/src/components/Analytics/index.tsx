import { useMemo } from 'react'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import { apps, apps_feedback } from '@prisma/client'

import { getFeedData, aggregateGuidesFeedback } from 'feedback'
import Text from 'components/typography/Text'
import HeaderLink from 'components/Header/Navigation/HeaderLink'

import GuidesOverview from './GuidesOverview'
import FeedbackFeed from './Feed'

export interface Props {
  app: apps
  feedback: apps_feedback[]
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

function Analytics({ app, feedback }: Props) {
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
        {!view && <GuidesOverview guides={guidesFeedback} />}
        {view === 'feedback' && <FeedbackFeed feed={feed} guides={guidesFeedback} />}
      </div>
    </div>
  )
}

export default Analytics
