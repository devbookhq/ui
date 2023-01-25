import { useMemo } from 'react'

import useAppFeedback from 'hooks/useAppFeedback'
import { getFeedData, aggregateGuidesFeedback } from 'utils/analytics'
import { App } from 'queries/types'
import Text from 'components/typography/Text'

import GuidesOverview from './GuidesOverview'
import Spinner from 'components/icons/Spinner'
import FeedbackFeed from './Feed'
import { useRouter } from 'next/router'
import clsx from 'clsx'

export interface Props {
  app: App
}


const views = [
  {
    label: 'Overview',
    value: '',
  },
  {
    label: 'Feedback',
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

  function changeView(view?: string) {
    router.query.view = view
    router.push(router, undefined, {
      shallow: true,
    })
  }

  const router = useRouter()
  const view = router.query.view || ''

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="pt-3 flex space-y-2 justify-between flex-col bg-white">
        <Text text={app.title} size={Text.size.S1} className="px-4" />
        <div
          className={clsx('flex border-b border-slate-200 px-4 space-x-4')}
        >
          {views.map(v => (
            <div
              className="group relative flex justify-center pb-3 cursor-pointer group"
              key={v.label}
              onClick={() => changeView(v.value)}
            >
              <Text
                className={clsx('transition-all group-hover:text-green-800', { 'text-green-800': v.value === view, 'text-slate-400': v.value !== view })}
                size={Text.size.S2}
                text={v.label}
              />
              <div
                className={clsx({ 'border-green-800': v.value === view, 'border-transparent': v.value !== view }, 'absolute bottom-0 -mb-px w-full rounded-t border-b-2 transition-all')}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="overflow-hidden justify-center flex flex-1">
        {isLoading && <Spinner className="m-auto" />}
        {!isLoading &&
          <>
            {!view &&
              <>
                <GuidesOverview guides={guidesFeedback} />
              </>
            }
            {view === 'feedback' && <FeedbackFeed feed={feed} guides={guidesFeedback} />}
          </>
        }
      </div>
    </div>
  )
}

export default Feedback
