import { apps_feedback } from 'database'
import { AppFeedbackPropertiesJSON, Rating } from 'queries/db'

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

export function getGuideName(guidePath: string) {
  // guidePath looks like a URL path '/guide/<guide_id>?optionalStep' -> ['', 'guide', '<guide_id>']
  return guidePath.split('/')[2].split('?')[0].split(/[_-]+/).map(capitalizeFirstLetter).join(' ')
}

export function aggregateGuidesFeedback(feedback: Required<apps_feedback>[]) {
  const guides = feedback.reduce<{ [guideID: string]: GuideFeedback }>((prev, curr) => {
    const properties = curr.properties as AppFeedbackPropertiesJSON

    if (!properties) return prev
    if (!properties.guide) return prev
    let guide = prev[properties.guide]
    if (!guide) {
      guide = {
        link: (hostnames[curr.appId] && properties.guide) ? `https://${hostnames[curr.appId]}${properties.guide}` : undefined,
        upvotes: 0,
        downvotes: 0,
        userMessages: [],
        ratingPercentage: 0,
        ratings: [],
        feed: [],
        id: properties.guide!,
        title: getGuideName(properties.guide),
        totalMessages: 0,
      }
      prev[properties.guide] = guide
    }

    if (curr.feedback) {
      guide.userMessages.push({
        text: curr.feedback,
        timestamp: new Date(curr.created_at),
        rating: properties.rating!,
        userID: properties.userId || properties.anonymousId!,
      })
      guide.totalMessages += 1
    } else if (properties.rating === Rating.Upvote) {
      guide.upvotes += 1
      guide.ratings.push({
        rating: properties.rating,
        timestamp: new Date(curr.created_at),
        userID: properties.userId || properties.anonymousId!,
      })
    } else if (properties.rating === Rating.Downvote) {
      guide.downvotes += 1
      guide.ratings.push({
        rating: properties.rating,
        timestamp: new Date(curr.created_at),
        userID: properties.userId || properties.anonymousId!,
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
        let isCleaned = false
        for (let j = i; j >= 0; j--) {
          if (g.feed[j].userID === e.userID && !('text' in g.feed[j]) && g.feed[j].rating === e.rating) {
            g.feed.splice(j, 1)
            isCleaned = true
            break
          }
        }

        if (isCleaned) {
          continue
        }

        for (let j = g.feed.length - 1; j > i; j--) {
          if (g.feed[j].userID === e.userID && !('text' in g.feed[j]) && g.feed[j].rating === e.rating) {
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