import Text from 'components/typography/Text'
import { ThumbsDown, ThumbsUp } from 'lucide-react'
import Link from 'next/link'
import { Rating } from 'queries/types'
import { FeedMessage } from '.'

export interface Props {
  message: FeedMessage
}

function Message({ message }: Props) {
  return (
    <div className="space-y-4 flex flex-1 flex-col justify-between mx-2 rounded-lg border bg-white p-4">
      <div className="flex justify-between flex-1">
        <div className="flex space-x-1 text-slate-500 items-center flex-1">
          {/* <MessageSquare size="18px" className="text-slate-600/40 mr-2" /> */}
          {message.rating === Rating.Upvote
            ? <ThumbsUp
              className="text-green-500 mr-1.5 -mt-0.5"
              size="18px"
              stroke-width="1.5"
            />
            : <ThumbsDown
              className="text-red-500 mr-1.5 -mb-0.5"
              size="18px"
              stroke-width="1.5"
            />
          }
          <Text text="User left feedback in the" size={Text.size.S3}></Text>
          <Link
            href={message.guide.link || ''}
            className="hover:text-green-700 flex group text-green-600"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Text text={message.guide.title} className="whitespace-nowrap" size={Text.size.S3} />
          </Link>
          <Text text="guide" size={Text.size.S3}></Text>
        </div>
        <Text
          text={message.timestamp.toDateString()}
          size={Text.size.S3}
          className="text-slate-400 self-center"
        />
        <div>

        </div>
      </div>
      <div className="flex space-x-4 flex-1 items-center">
        <Text text={'"' + message.text + '"'} className="italic max-w-prose" />
      </div>
    </div>
  )
}

export default Message
