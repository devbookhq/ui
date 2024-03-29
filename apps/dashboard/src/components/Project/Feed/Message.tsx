import {
  ThumbsDown,
  ThumbsUp,
  ExternalLink,
  Mail,
  MessageSquare,
} from 'lucide-react'
import Link from 'next/link'

import Text from 'components/typography/Text'
import { Rating } from 'queries/db'
import { FeedEntry } from 'feedback'

export interface Props {
  message: FeedEntry
}

function Message({ message }: Props) {
  return (
    <div className="
      flex
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
        space-y-4
        items-start
        justify-start
      ">
        <div className="
          flex
          space-x-1
          text-slate-500
        ">
          {message.rating === Rating.Upvote &&
            <ThumbsUp
              className="text-green-500 mr-1.5 -mt-0.5"
              size="18px"
              strokeWidth="1.5"
            />
          }
          {message.rating === Rating.Downvote &&
            <ThumbsDown
              className="text-red-500 mr-1.5 -mb-0.5"
              size="18px"
              strokeWidth="1.5"
            />
          }
          {!message.rating &&
            <MessageSquare
              className="text-slate-300 mr-1.5 -mb-0.5"
              size="18px"
              strokeWidth="1.5"
            />
          }
          <Link
            href={message.feedback?.link + (message?.guideStep !== undefined ? `?step=${message.guideStep}` : '') || ''}
            className="
              hover:text-blue-600
              flex
              items-center
              group
              text-blue-500
              space-x-1
            "
            target="_blank"
            rel="noopener noreferrer"
          >
            <>
              <Text text={message.feedback?.from === 'guide' ? 'Guide |' : 'Code Example |'} size={Text.size.S3} />
              {message.guideStep
                ? <Text text={`${message.feedback?.title || ''} | Step ${message.guideStep}`} className="whitespace-nowrap" size={Text.size.S3} />
                : <Text text={message.feedback?.title || ''} className="whitespace-nowrap" size={Text.size.S3} />
              }
            </>
            <ExternalLink
              size={14}
            />
          </Link>
        </div>
        <div className="flex space-x-4 flex-1 items-center">
          {('text' in message && message.text)
            ?
            <Text text={'"' + message.text + '"'} className="italic max-w-prose" />
            :
            <Text text="No message left" className="max-w-prose text-slate-400" size={Text.size.S3} />
          }
        </div>
        {'email' in message && message.email &&
          <div className="
            flex
            items-center
            justify-start
            space-x-1
          ">
            <Mail
              className="
                text-slate-500
                relative
                top-px
              "
              size={14}
            />
            <Text
              text={message.email}
              size={Text.size.S2}
              className="text-slate-600"
            />
          </div>
        }
      </div>
      <div>
        <Text
          text={message.timestamp.toDateString()}
          size={Text.size.S3}
          className="text-slate-400"
        />
      </div>
    </div>
  )
}

export default Message
