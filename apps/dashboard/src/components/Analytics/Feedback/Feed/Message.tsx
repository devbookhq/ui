import { ThumbsDown, ThumbsUp, ExternalLink } from 'lucide-react'
import Link from 'next/link'

import Text from 'components/typography/Text'
import { Rating } from 'queries/db'
import { FeedEntry } from 'utils/analytics'

export interface Props {
  message: FeedEntry
}

function Message({ message }: Props) {
  return (
    <div className="
      space-y-4
      flex
      flex-col
      justify-between
      mx-2
      rounded-lg
      border
      bg-white
      p-4
    ">
      <div className="
        flex
        flex-col
        md:flex-row
        space-y-2
        md:space-y-0
        items-start
        md:items-center
        justify-start
        md:justify-between
      ">
        <div className="
          flex
          space-x-1
          text-slate-500
        ">
          {message.rating === Rating.Upvote
            ? <ThumbsUp
              className="text-green-500 mr-1.5 -mt-0.5"
              size="18px"
              strokeWidth="1.5"
            />
            : <ThumbsDown
              className="text-red-500 mr-1.5 -mb-0.5"
              size="18px"
              strokeWidth="1.5"
            />
          }
          <Link
            href={message.guide?.link || ''}
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
            <Text text={message.guide?.title || ''} className="whitespace-nowrap" size={Text.size.S3} />
            <ExternalLink
              size={14}
            />
          </Link>
        </div>
        <Text
          text={message.timestamp.toDateString()}
          size={Text.size.S3}
          className="text-slate-400"
        />
      </div>
      <div className="flex space-x-4 flex-1 items-center">
        {('text' in message && message.text)
          ?
          <Text text={'"' + message.text + '"'} className="italic max-w-prose" />
          :
          <Text text="No message left" className="max-w-prose text-slate-400" size={Text.size.S3} />
        }
      </div>
    </div>
  )
}

export default Message
