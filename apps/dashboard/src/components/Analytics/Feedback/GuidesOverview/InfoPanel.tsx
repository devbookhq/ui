import Text from 'components/typography/Text'
import { calculateTotalRating, GuideFeedback } from 'utils/analytics'

export interface Props {
  guides: GuideFeedback[]
}

function InfoPanel({ guides }: Props) {
  const totalRating = calculateTotalRating(guides)

  return (
    <div className="flex flex-1 px-3 py-2 border rounded justify-between bg-slate-50 space-x-6">
      {totalRating &&
        <>
          <div className="flex flex-col">
            <Text
              text="Overall rating"
              className="text-slate-400"
              size={Text.size.S3}
            />
            {totalRating.rating >= 0.9 &&
              <Text
                text={(totalRating.rating * 100).toPrecision(3) + '%'}
                className="text-green-500 text-xl"
              />
            }
            {totalRating.rating < 0.9 && totalRating.rating >= 0.7 &&
              <Text
                text={(totalRating.rating * 100).toPrecision(3) + '%'}
                className="text-yellow-400 text-xl"
              />
            }
            {totalRating.rating < 0.7 &&
              <Text
                text={(totalRating.rating * 100).toPrecision(3) + '%'}
                className="text-red-600 text-xl"
              />
            }
          </div>
          <div className="flex flex-col">
            <Text
              text="Total upvotes"
              className="text-slate-400"
              size={Text.size.S3}
            />
            <Text
              text={totalRating.upvotes.toString()}
              className="text-green-500 text-xl"
            />
          </div>
          <div className="flex flex-col">
            <Text
              text="Total downvotes"
              className="text-slate-400"
              size={Text.size.S3}
            />
            <Text
              text={totalRating.downvotes.toString()}
              className="text-red-500 text-xl"
            />
          </div>
          <div className="flex flex-col">
            <Text
              text="Total messages"
              className="text-slate-400"
              size={Text.size.S3}
            />
            <Text
              text={totalRating.messages.toString()}
              className="text-slate-500 text-xl"
            />
          </div>
        </>
      }
    </div>
  )
}

export default InfoPanel
