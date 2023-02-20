import { useMemo, useState, useEffect } from 'react'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

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
import AppInfo from './AppInfo'

type SelectedFeedback = 'guides' | 'codeExamples'

export interface Props {
  app: apps & {
    github_repositories: {
      repository_fullname: string;
    } | null
  }
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

function Project({ app, feedback }: Props) {
  const [selectedFeedback, setSelectedFeedback] = useState<SelectedFeedback>('guides')
  const [guidesFeedback, codeExamplesFeedback, feed] = useMemo(() => {
    const feedbackByGuide = aggregateFeedbackBy('guides', feedback)
    const feedbackByCodeExample = aggregateFeedbackBy('codeExamples', feedback)
    const feed = getFeedData([...feedbackByGuide, ...feedbackByCodeExample])
    return [feedbackByGuide, feedbackByCodeExample, feed]
  }, [feedback])

  useEffect(function handleFeedbackSelection() {
    if (guidesFeedback.length === 0) {
      setSelectedFeedback('codeExamples')
    } else if (codeExamplesFeedback.length === 0) {
      setSelectedFeedback('guides')
    }
  }, [guidesFeedback, codeExamplesFeedback])

  const router = useRouter()
  const view = router.query.view || ''

  const [deployedUrl, setDeployedUrl] = useState<string>()

  useEffect(function getUrl() {
    if (typeof window !== undefined) {
      setDeployedUrl(`https://${app.subdomain}.${window.location.host}`)
    }
  }, [app.subdomain])

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex justify-between bg-white border-b border-slate-200 items-center">
        <div className="flex flex-col">
          <div className="flex pt-2 px-4 items-center">
            <>
              {app.repository_id &&
                <Link
                  href={{
                    pathname: deployedUrl,
                  }}
                  className="flex space-x-1 hover:text-blue-600  text-blue-500"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Text text={app.title || app.id} size={Text.size.S1} />
                  <ExternalLink size="12px" />
                </Link>
              }

              {!app.repository_id &&
                <Text text={app.title || app.id} size={Text.size.S1} />
              }
            </>
          </div>
          <div
            className={clsx('flex px-4 space-x-2')}
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
        <AppInfo app={app} />
      </div>
      <div className="
        flex-1
        overflow-hidden
        justify-center
        flex
      ">
        {feedback.length === 0 &&
          <Text
            text="There is no feedback for this project yet"
            size={Text.size.S3}
            className="text-slate-400 self-center"
          />
        }
        {feedback.length > 0 && !view &&
          <div className="
            py-4
            flex-1
            flex
            flex-col
            overflow-hidden
          ">
            {(guidesFeedback.length !== 0 && codeExamplesFeedback.length !== 0) &&
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
            }
            <FeedbackOverview
              feedback={selectedFeedback === 'guides' ? guidesFeedback : codeExamplesFeedback}
            />
          </div>
        }
        {feedback.length > 0 && view === 'feedback' &&
          <FeedbackFeed
            feed={feed}
            feedback={[...guidesFeedback, ...codeExamplesFeedback]}
          />
        }
      </div>
    </div >
  )
}

export default Project
