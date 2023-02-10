import clsx from 'clsx'
import { ExternalLink, ThumbsDown, ThumbsUp } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback, useMemo } from 'react'

import Text from 'components/typography/Text'
import { Feedback } from 'feedback'

import InfoPanel from './InfoPanel'
import SortControl, { SortOrder, applySorting, Column, SetConfig } from './SortControl'

export interface Props {
  feedback: Feedback[]
}

function FeedbackOverview({ feedback }: Props) {
  const router = useRouter()

  const order: SortOrder = router.query.order as any as SortOrder || SortOrder.Descending
  const column: Column = router.query.column as Column || 'upvotes'

  const config = useMemo(() => ({ order, column }), [order, column])
  const setConfig = useCallback<(c: SetConfig) => any>((c) => {
    const newConfig = c(config)
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        ...newConfig,
      },
    }, undefined, {
      shallow: true,
    })
  }, [config, router])

  const sortedFeedback = applySorting(feedback, { order, column })

  return (
    <div className="
      flex
      flex-1
      justify-center
      p-4
      items-start
      overflow-hidden
    ">
      <div className="
        flex
        flex-col
        flex-1
        space-y-3
        max-w-[1100px]
        max-h-full
        overflow-hidden
      ">
        <InfoPanel feedback={feedback} />
        <Text
          text="Not yet rated items aren't shown"
          size={Text.size.S3}
          className="text-slate-400 self-center"
        />
        <div className="
          flex
          flex-col
          flex-1

          rounded
          border-x
          border-t
          scroller
          max-h-full
          overflow-auto
        ">
          <table className="table-auto text-slate-500 rounded">
            <thead className="text-slate-500 bg-slate-50 uppercase border-b">
              <tr>
                <th scope="col" className="p-3">
                  <Text text="Item" size={Text.size.S3} />
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
              {sortedFeedback.map(f => (
                <tr className="bg-white border-b hover:bg-slate-50/10" key={f.id}>
                  <td
                    scope="row"
                    className="
                      w-[338px]
                      p-3
                      font-medium
                      whitespace-nowrap
                  ">
                    <Link
                      className="
                        hover:text-blue-600
                        flex
                        justify-start
                        items-center
                        group
                        text-blue-500
                        space-x-1
                      "
                      href={f.link || ''}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Text text={f.title} className="whitespace-nowrap" size={Text.size.S3} />
                      <ExternalLink
                        size={14}
                      />
                    </Link>
                  </td>
                  <td className="p-3">
                    <Text text={f.upvotes.toString()} />
                  </td>
                  <td className="p-3">
                    <Text text={f.downvotes.toString()} />
                  </td>
                  <td className="p-3">
                    {f.ratingPercentage >= 0.9 &&
                      <Text
                        text={(f.ratingPercentage * 100).toPrecision(3) + '%'}
                        className="text-green-500"
                      />
                    }
                    {f.ratingPercentage < 0.9 && f.ratingPercentage >= 0.7 &&
                      <Text
                        text={(f.ratingPercentage * 100).toPrecision(3) + '%'}
                        className="text-yellow-500"
                      />
                    }
                    {f.ratingPercentage < 0.7 &&
                      <Text
                        text={(f.ratingPercentage * 100).toPrecision(3) + '%'}
                        className="text-red-600"
                      />
                    }
                  </td>
                  <td className="p-3">
                    <div className="flex space-x-1">
                      <Text text={f.userMessages.length.toString()} className="min-w-[24px]" />
                      {f.feed.some(f => 'text' in f && f.isFromToday)
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
                          item: f.id,
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

export default FeedbackOverview
