import clsx from 'clsx'
import Text from 'components/typography/Text'
import { ExternalLink, ThumbsDown, ThumbsUp } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { GuideFeedback } from 'utils/analytics'
import InfoPanel from './InfoPanel'
import SortControl, { SortOrder, applySorting, SortingConfig } from './SortControl'

export interface Props {
  guides: GuideFeedback[]
}

function GuidesOverview({ guides }: Props) {
  const router = useRouter()

  const [config, setConfig] = useState<SortingConfig>({
    order: SortOrder.Descending,
    column: 'upvotes',
  })

  const sortedGuides = applySorting(guides, config)

  return (
    <div className="scroller overflow-auto flex flex-1 justify-center p-4 items-start">
      <div className="flex flex-col flex-1 space-y-3 overflow-hidden max-w-[1100px]">
        <Text
          text="Guides without any rating aren't shown"
          size={Text.size.S3}
          className="text-slate-400 self-center"
        />
        <InfoPanel guides={guides} />
        <div className="
            flex
            flex-col
            flex-1

            rounded
            scroller
            border-x
            border-t
            overflow-hidden
            overflow-x-auto
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
                <tr className="bg-white border-b hover:bg-slate-50/10" key={g.id}>
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
                        className="text-green-500"
                      />
                    }
                    {g.ratingPercentage < 0.9 && g.ratingPercentage >= 0.7 &&
                      <Text
                        text={(g.ratingPercentage * 100).toPrecision(3) + '%'}
                        className="text-yellow-500"
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
                    <div className="flex space-x-1">
                      <Text text={g.userMessages.length.toString()} className="min-w-[24px]" />
                      {g.feed.some(f => 'text' in f && f.isFromToday)
                        ? <Text
                          text="(new in the last 24h)"
                          size={Text.size.S3}
                          className="whitespace-nowrap italic"
                        />
                        : null}
                    </div>
                  </td>
                  <td>
                    <Link
                      href={{
                        pathname: router.pathname,
                        query: {
                          ...router.query,
                          guide: g.id,
                          view: 'feedback',
                        },
                      }}
                      className={clsx(
                        'float-right',
                        'mr-3',
                        'bg-white',
                        'flex',
                        'whitespace-nowrap',
                        'group',
                        'space-x-1',
                        'items-center',
                        'justify-center',
                        'transition-all',
                        'rounded',
                        'border',
                        'py-1.5',
                        'px-3',
                        'border-slate-200',
                        'hover:border-green-800',
                        'hover:text-green-800',
                      )}
                      shallow
                    >
                      <Text text="See Feedback" size={Text.size.S3} />
                    </Link>
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
