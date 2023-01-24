import Button from 'components/Button'
import Text from 'components/typography/Text'
import { ExternalLink, ThumbsDown, ThumbsUp } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { GuideFeedback } from 'utils/analytics'
import SortControl, { SortOrder, applySorting, SortingConfig } from './SortControl'

export interface Props {
  guides: GuideFeedback[]
}

function GuidesOverview({ guides }: Props) {
  const router = useRouter()

  function checkGuideFeedback(guideID: string) {
    router.query.guide = guideID
    router.query.view = 'feedback'
    router.push({
      pathname: router.pathname,
      query: router.query,
    }, undefined, {
      shallow: true,
    })
  }
  const [config, setConfig] = useState<SortingConfig>({
    order: SortOrder.Descending,
    column: 'upvotes',
  })

  const sortedGuides = applySorting(guides, config)

  return (
    <div className="scroller overflow-auto flex flex-1 justify-center max-w-[950px] p-4 items-start">
      <div className="flex flex-col flex-1 space-y-3">
        <Text text="Guides without any rating aren't shown" size={Text.size.S3} className="text-slate-400" />
        <div className="
      flex
      flex-col
      flex-1
      max-w-[900px]
      min-w-[200px]
      rounded
      scroller
      overflow-hidden
      overflow-x-auto
      shadow
    ">
          <table className="table-auto text-slate-500 rounded overflow-hidden">
            <thead className="text-slate-500 bg-slate-50 uppercase border-b">
              <tr>
                <th scope="col" className="p-3">
                  <Text text="Guide" size={Text.size.S3} />
                </th>
                <th scope="col" className="p-3">
                  <div className="flex space-x-1">
                    <SortControl
                      column='upvotes'
                      config={config}
                      setConfig={setConfig}
                    >
                      <ThumbsUp
                        className="text-green-500"
                        size="18px"
                        strokeWidth="1.5"
                      />
                    </SortControl>
                  </div>
                </th>
                <th scope="col" className="px-3">
                  <div className="flex space-x-1">
                    <SortControl
                      column='downvotes'
                      config={config}
                      setConfig={setConfig}
                    >
                      <ThumbsDown
                        className="text-red-500"
                        size="18px"
                        strokeWidth="1.5"
                      />
                    </SortControl>
                  </div>
                </th>
                <th scope="col" className="p-3">
                  <div className="flex space-x-1">
                    <SortControl
                      column='ratingPercentage'
                      config={config}
                      setConfig={setConfig}
                    >
                      <Text text="Rating" size={Text.size.S3} />
                    </SortControl>
                  </div>
                </th>
                <th scope="col" className="p-3">
                  <div className="flex space-x-1">
                    <SortControl
                      column='totalMessages'
                      config={config}
                      setConfig={setConfig}
                    >
                      <Text text="Messages" size={Text.size.S3} />
                    </SortControl>
                  </div>
                </th>
                <th scope="col" className="p-3" />
              </tr>
            </thead>
            <tbody className="rounded-b">
              {sortedGuides.map(g => (
                <tr className="bg-white border-b" key={g.id}>
                  <th scope="row" className="p-3 font-medium whitespace-nowrap">
                    <Link
                      href={g.link || ''}
                      className="
                      hover:text-blue-600
                      flex
                      group
                      text-blue-500
                      space-x-1
                    "
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Text text={g.title} className="whitespace-nowrap" size={Text.size.S3} />
                      <ExternalLink
                        size={14}
                      />
                    </Link>
                  </th>
                  <td className="p-3">
                    <Text text={g.upvotes.toString()} />
                  </td>
                  <td className="p-3">
                    <Text text={g.downvotes.toString()} />
                  </td>
                  <td className="p-3">
                    {g.ratingPercentage >= 0.9 &&
                      <Text
                        text={(g.ratingPercentage * 100).toPrecision(3) + '%'}
                        className="text-green-700"
                      />
                    }
                    {g.ratingPercentage < 0.9 && g.ratingPercentage >= 0.7 &&
                      <Text
                        text={(g.ratingPercentage * 100).toPrecision(3) + '%'}
                        className="text-yellow-400"
                      />
                    }
                    {g.ratingPercentage < 0.7 &&
                      <Text
                        text={(g.ratingPercentage * 100).toPrecision(3) + '%'}
                        className="text-red-600"
                      />
                    }
                  </td>
                  <td className="p-3">
                    <div className="flex space-x-2">
                      <Text text={g.userMessages.length.toString()} />
                      {g.feed.some(f => 'text' in f && f.isFromToday)
                        ? <Text
                          text="(new in the last 24h)"
                          size={Text.size.S3}
                          className="whitespace-nowrap italic"
                        />
                        : null}
                    </div>
                  </td>
                  <td className="">
                    <Button
                      onClick={() => checkGuideFeedback(g.id)}
                      text="See Feedback"
                      className="
                      float-right
                      mr-3
                      flex
                      whitespace-nowrap
                      group
                      space-x-1
                    "
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default GuidesOverview
