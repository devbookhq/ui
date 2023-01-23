import Text from 'components/typography/Text'
import { ExternalLink, MessageSquare, ThumbsDown, ThumbsUp } from 'lucide-react'
import Link from 'next/link'
import { GuideFeedback } from 'utils/analytics'

export enum GuideOverviewColumn {
  Name,
  Rating,
  Messages,
}

export interface Props {
  guide: GuideFeedback
}

function GuideOverview({ guide }: Props) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 space-x-2 border-b px-4 items-center py-2">
        <Link
          href={guide.link || ''}
          className="hover:text-green-700 flex space-x-0.5 group"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Text text={guide.title} />
          <ExternalLink
            size="12px"
            className="text-slate-300 group-hover:text-green-700"
          />
        </Link>

        <div className="flex items-center">
          <Text
            text={guide.upvotes.toString()}
            size={Text.size.S2}
            className="text-slate-600"
          />
          <ThumbsUp
            className="text-green-500 ml-1"
            size="18px"
          />
        </div>

        <div className="flex items-center">
          <Text
            text={guide.downvotes.toString()}
            size={Text.size.S2}
            className="text-slate-600"
          />
          <ThumbsDown
            className="text-red-500 ml-1"
            size="18px"
          />
        </div>

        <div className="flex items-center">
          <Text
            text={guide.userMessages.length.toString()}
            size={Text.size.S2}
            className="text-slate-600"
          />
          <MessageSquare
            className="text-slate-500 ml-1"
            size="18px"
          />
        </div>
      </div>
    </div>
  )
}

export default GuideOverview
