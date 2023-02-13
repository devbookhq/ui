import { UserMessage, ItemFeedbackOverview, UserRating } from './feedback'

export interface FeedExtension {
  feedback?: ItemFeedbackOverview
  isFromYesterday: boolean
  isFromToday: boolean
}

export interface FeedMessage extends UserMessage, FeedExtension { }
export interface FeedRating extends UserRating, FeedExtension { }
export type FeedEntry = FeedMessage | FeedRating

export function getFeedData(feedback: ItemFeedbackOverview[]): FeedEntry[] {
  const feed = feedback.flatMap(f => {
    const messages = f.feed.map(m => {
      return {
        feedback: f,
        ...m,
      }
    })
    return messages
  })

  feed.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  return feed
}
