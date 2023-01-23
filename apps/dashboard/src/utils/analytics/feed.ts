import { UserMessage, GuideFeedback, UserRating } from './feedback'

const hourInMs = 60 * 60 * 1000

export interface FeedExtension {
  guide: GuideFeedback
  isFromYesterday: boolean
  isFromToday: boolean
}

export interface FeedMessage extends UserMessage, FeedExtension { }
export interface FeedRating extends UserRating, FeedExtension { }
export type FeedEntry = FeedMessage | FeedRating

export function getFeedData(feedback: GuideFeedback[]): FeedEntry[] {
  const timeNow = new Date().getTime()

  const feed = feedback.flatMap(g => {
    const messages = g.feed.map(m => {
      const isFromToday = (timeNow - m.timestamp.getTime()) / hourInMs < 24
      const isFromYesterday = !isFromToday && (timeNow - m.timestamp.getTime()) / hourInMs < 48
      return {
        guide: g,
        ...m,
        isFromToday,
        isFromYesterday,
      }
    })
    return messages
  })

  feed.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  return feed
}
