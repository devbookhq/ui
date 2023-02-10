import { useMemo, useState } from 'react'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import { apps, apps_feedback } from 'database'

import {
  getFeedData,
  aggregateFeedbackBy,
} from 'feedback'
import Text from 'components/typography/Text'
import HeaderLink from 'components/Header/Navigation/HeaderLink'
import SelectButton from 'components/SelectButton'

import FeedbackOverview from './FeedbackOverview'
import FeedbackFeed from './Feed'

type SelectedFeedback = 'guides' | 'codeExamples'

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
  const [selectedFeedback, setSelectedFeedback] = useState<SelectedFeedback>('guides')
  const [guidesFeedback, codeExamplesFeedback, feed] = useMemo(() => {
    console.log({ feedback })
    const feedbackByGuide = aggregateFeedbackBy('guides', feedback)
    const feedbackByCodeExample = aggregateFeedbackBy('codeExamples', feedback)
    const feed = getFeedData([...feedbackByGuide, ...feedbackByCodeExample])
    return [feedbackByGuide, feedbackByCodeExample, feed]
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
      <div className="
        flex-1
        overflow-hidden
        justify-center
        flex
      ">
        {!view &&
          <div className="
            py-4
            flex-1
            flex
            flex-col
            overflow-hidden
          ">
            <div className="
              flex
              justify-center
              space-x-4
            ">
              <SelectButton
                text="Guides"
                isSelected={selectedFeedback === 'guides'}
                onClick={() => setSelectedFeedback('guides')}
              />
              <SelectButton
                text="Code Examples"
                isSelected={selectedFeedback === 'codeExamples'}
                onClick={() => setSelectedFeedback('codeExamples')}
              />
            </div>
            <FeedbackOverview
              feedback={selectedFeedback === 'guides' ? guidesFeedback : codeExamplesFeedback}
            />
          </div>
        }
        {view === 'feedback' &&
          <FeedbackFeed
            feed={feed}
            feedback={[...guidesFeedback, ...codeExamplesFeedback]}
          />
        }
      </div>
    </div>
  )
}

export default Analytics
