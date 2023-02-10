import { UserMessage, Feedback, UserRating } from './feedback'

export interface FeedExtension {
  feedback?: Feedback
  isFromYesterday: boolean
  isFromToday: boolean
}

export interface FeedMessage extends UserMessage, FeedExtension { }
export interface FeedRating extends UserRating, FeedExtension { }
export type FeedEntry = FeedMessage | FeedRating

export function getFeedData(feedback: Feedback[]): FeedEntry[] {
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
