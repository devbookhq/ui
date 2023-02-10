import { apps_feedback } from 'database'
import { AppFeedbackPropertiesJSON, Rating } from 'queries/db'

import { FeedEntry } from './feed'

export interface UserMessage {
  userID: string
  timestamp: Date
  text: string
  rating: Rating
}

export interface UserRating {
  userID: string
  timestamp: Date
  rating: Rating
}

export interface Feedback {
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
  guideStep?: string
  from: 'guide' | 'codeExample'
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
  // guidePath looks like a URL path '/guide/<guide_id>?optionalstep=1' -> ['', 'guide?optinalstep=1', '<guide_id>']
  return guidePath.split('/')[2].split('?')[0].split(/[_-]+/).map(capitalizeFirstLetter).join(' ')
}

export function aggregateFeedbackBy(by: 'guides' | 'codeExamples', feedback: Required<apps_feedback>[]) {
  const key = by === 'guides' ? 'guide' : 'codeExamplePath'

  const items = feedback.reduce<({ [id: string]: Feedback })>((prev, curr) => {
    const properties = curr.properties as AppFeedbackPropertiesJSON
    if (!properties) return prev

    const val = properties[key]
    if (!val) return prev

    let item = prev[val]
    if (!item) {
      let link = ''
      if (hostnames[curr.appId]) {
        link = `https://${hostnames[curr.appId]}${val}`
      } else {
        throw new Error(`Unknown appID: '${curr.appId}'`)
      }

      item = {
        link,
        upvotes: 0,
        downvotes: 0,
        userMessages: [],
        ratingPercentage: 0,
        ratings: [],
        feed: [],
        id: properties[key]!,
        title: by === 'guides' ? getGuideName(properties.guide!) : properties.codeExampleTitle!,
        totalMessages: 0,
        guideStep: properties.guideStep,
        from: by === 'guides' ? 'guide' : 'codeExample',
      }
      prev[val] = item
    }

    if (curr.feedback) {
      item.userMessages.push({
        text: curr.feedback,
        timestamp: new Date(curr.created_at),
        rating: properties.rating!,
        userID: properties.userId || properties.anonymousId!,
      })
      item.totalMessages += 1
    } else if (properties.rating === Rating.Upvote) {
      item.upvotes += 1
      item.ratings.push({
        rating: properties.rating,
        timestamp: new Date(curr.created_at),
        userID: properties.userId || properties.anonymousId!,
      })
    } else if (properties.rating === Rating.Downvote) {
      item.downvotes += 1
      item.ratings.push({
        rating: properties.rating,
        timestamp: new Date(curr.created_at),
        userID: properties.userId || properties.anonymousId!,
      })
    }

    return prev
  }, {})

  Object.values(items).forEach(item => {
    if (!item.downvotes && !item.upvotes) {
    } else if (!item.downvotes) {
      item.ratingPercentage = 1
    } else if (!item.upvotes) {
      item.ratingPercentage = 0
    } else {
      item.ratingPercentage = item.upvotes / (item.upvotes + item.downvotes)
    }

    item.ratings.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    item.userMessages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

    const timeNow = new Date().getTime()

    item.feed = [
      ...item.ratings,
      ...item.userMessages,
    ].map(m => {
      const isFromToday = (timeNow - m.timestamp.getTime()) / hourInMs < 24
      const isFromYesterday = !isFromToday && (timeNow - m.timestamp.getTime()) / hourInMs < 48
      return {
        ...m,
        isFromToday,
        isFromYesterday,
      }
    })

    item.feed.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

    // Filter our the duplicate upvotes from guides
    for (let i = item.feed.length - 1; i >= 0; i--) {
      const entry = item.feed[i]

      // Only feedback with messages have the field 'text'.
      if ('text' in entry) {
        let isCleaned = false
        for (let j = i; j >= 0; j--) {
          if (item.feed[j].userID === entry.userID && !('text' in item.feed[j]) && item.feed[j].rating === entry.rating) {
            item.feed.splice(j, 1)
            isCleaned = true
            break
          }
        }

        if (isCleaned) {
          continue
        }

        for (let j = item.feed.length - 1; j > i; j--) {
          if (item.feed[j].userID === entry.userID && !('text' in item.feed[j]) && item.feed[j].rating === entry.rating) {
            item.feed.splice(j, 1)
            break
          }
        }
      }
    }
  })

  return Object.values(items)
}

export function calculateTotalRating(feedback?: Feedback[]) {
  if (!feedback) return

  const downvotes = feedback.reduce((curr, prev) => {
    return curr + prev.downvotes
  }, 0)

  const upvotes = feedback.reduce((curr, prev) => {
    return curr + prev.upvotes
  }, 0)

  const rating = upvotes / (upvotes + downvotes)

  return {
    upvotes,
    downvotes,
    rating,
    messages: feedback.flatMap(g => g.userMessages).length,
  }
}