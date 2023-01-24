import { AppFeedback, Rating } from 'queries/types'
import { FeedEntry } from './feed'

interface Feedback {
  userID: string
  timestamp: Date
}

export interface UserMessage extends Feedback {
  text: string
  rating: Rating
}

export interface UserRating extends Feedback {
  rating: Rating
}

export interface GuideFeedback {
  id: string
  upvotes: number
  downvotes: number
  ratingPercentage: number
  title: string
  link?: string
  // Ordered in descending order
  feed: FeedEntry[]
  // Ordered in descending order
  ratings: UserRating[]
  // Ordered in descending order
  userMessages: UserMessage[]
  totalMessages: number
}

interface Hostnames {
  [appId: string]: string
}

const hostnames: Hostnames = {
  'prisma-hub': 'playground.prisma.io',
}

const hourInMs = 60 * 60 * 1000

export function capitalizeFirstLetter(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function getGuideName(guideID: string) {
  return guideID.split('/')[2].split(/[_-]+/).map(capitalizeFirstLetter).join(' ')
}

export function aggregateGuidesFeedback(feedback: Required<AppFeedback>[]) {
  const guides = feedback.reduce<{ [guideID: string]: GuideFeedback }>((prev, curr) => {
    if (!curr.properties) return prev
    if (!curr.properties.guide) return prev
    let guide = prev[curr.properties.guide]
    if (!guide) {
      guide = {
        link: (hostnames[curr.appId] && curr.properties.guide) ? `https://${hostnames[curr.appId]}${curr.properties.guide}` : undefined,
        upvotes: 0,
        downvotes: 0,
        userMessages: [],
        ratingPercentage: 0,
        ratings: [],
        feed: [],
        id: curr.properties.guide!,
        title: getGuideName(curr.properties.guide),
        totalMessages: 0,
      }
      prev[curr.properties.guide] = guide
    }

    if (curr.feedback) {
      guide.userMessages.push({
        text: curr.feedback,
        timestamp: new Date(curr.created_at),
        rating: curr.properties.rating!,
        userID: curr.properties.userId || curr.properties.anonymousId!,
      })
      guide.totalMessages += 1
    } else if (curr.properties.rating === Rating.Upvote) {
      guide.upvotes += 1
      guide.ratings.push({
        rating: curr.properties.rating,
        timestamp: new Date(curr.created_at),
        userID: curr.properties.userId || curr.properties.anonymousId!,
      })
    } else if (curr.properties.rating === Rating.Downvote) {
      guide.downvotes += 1
      guide.ratings.push({
        rating: curr.properties.rating,
        timestamp: new Date(curr.created_at),
        userID: curr.properties.userId || curr.properties.anonymousId!,
      })
    }
    return prev
  }, {})

  Object.values(guides).forEach(g => {
    if (!g.downvotes && !g.upvotes) {
    } else if (!g.downvotes) {
      g.ratingPercentage = 1
    } else if (!g.upvotes) {
      g.ratingPercentage = 0
    } else {
      g.ratingPercentage = g.upvotes / (g.upvotes + g.downvotes)
    }

    g.ratings.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    g.userMessages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

    const timeNow = new Date().getTime()

    g.feed = [
      ...g.ratings,
      ...g.userMessages,
    ].map(m => {
      const isFromToday = (timeNow - m.timestamp.getTime()) / hourInMs < 24
      const isFromYesterday = !isFromToday && (timeNow - m.timestamp.getTime()) / hourInMs < 48
      return {
        ...m,
        isFromToday,
        isFromYesterday,
      }
    })

    g.feed.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

    // Filter our the duplicate upvotes from guides

    for (let i = g.feed.length - 1; i >= 0; i--) {
      const e = g.feed[i]

      if ('text' in e) {
        for (let j = i; j >= 0; j++) {
          if (g.feed[j].userID === e.userID && !('text' in g.feed[j])) {
            g.feed.splice(j, 1)
            break
          }
        }
      }
    }
  })
  return Object.values(guides)
}

export function calculateTotalRating(guides?: GuideFeedback[]) {
  if (!guides) return

  const downvotes = guides.reduce((curr, prev) => {
    return curr + prev.downvotes
  }, 0)

  const upvotes = guides.reduce((curr, prev) => {
    return curr + prev.upvotes
  }, 0)

  const rating = upvotes / (upvotes + downvotes)

  return {
    upvotes,
    downvotes,
    rating,
    messages: guides.flatMap(g => g.userMessages).length,
  }
}