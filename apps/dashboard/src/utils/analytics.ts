import { AppFeedback, Rating } from 'queries/types'

export interface UserMessage {
  userID: string
  text: string
  rating: Rating
  timestamp: Date
}

export interface UserRating {
  rating: Rating
  timestamp: Date
  userID: string
}

export type UserFeedback = UserMessage | UserRating

export interface GuideFeedback {
  id: string
  upvotes: number
  downvotes: number
  positivePercentage: number
  negativePercentage: number
  title: string
  link?: string
  // Ordered in descending order
  feed: UserFeedback[]
  // Ordered in descending order
  ratings: UserRating[]
  // Ordered in descending order
  userMessages: UserMessage[]
}

export function capitalizeFirstLetter(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function getGuideName(guideID: string) {
  return guideID.split('/')[2].split(/[_-]+/).map(capitalizeFirstLetter).join(' ')
}

interface Hostnames {
  [appId: string]: string
}

const hostnames: Hostnames = {
  'prisma-hub': 'playground.prisma.io',
}

export function formatGuidesFeedback(feedback: Required<AppFeedback>[]) {
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
        positivePercentage: 0,
        negativePercentage: 0,
        ratings: [],
        feed: [],
        id: curr.properties.guide!,
        title: getGuideName(curr.properties.guide),
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
      g.positivePercentage = 100
    } else if (!g.upvotes) {
      g.negativePercentage = 100
    } else {
      g.positivePercentage = g.upvotes / (g.upvotes + g.downvotes)
      g.negativePercentage = 100 - g.positivePercentage
    }

    g.ratings.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    g.userMessages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

    g.feed = [
      ...g.ratings,
      ...g.userMessages,
    ]
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
