import { UserMessage, GuideFeedback, UserRating } from './feedback'

export interface FeedExtension {
  guide?: GuideFeedback
  isFromYesterday: boolean
  isFromToday: boolean
}

export interface FeedMessage extends UserMessage, FeedExtension { }
export interface FeedRating extends UserRating, FeedExtension { }
export type FeedEntry = FeedMessage | FeedRating

export function getFeedData(feedback: GuideFeedback[]): FeedEntry[] {
  const feed = feedback.flatMap(g => {
    const messages = g.feed.map(m => {
      return {
        guide: g,
        ...m,
      }
    })
    return messages
  })

  feed.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  return feed
}
