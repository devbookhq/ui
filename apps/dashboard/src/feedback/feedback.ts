import { apps_feedback } from 'database'
import { AppFeedbackPropertiesJSON, Rating } from 'queries/db'

import { FeedEntry } from './feed'

export interface UserMessage {
  userID: string
  timestamp: Date
  text: string
  email?: string
  rating: Rating
  guideStep?: string
}

export interface UserRating {
  userID: string
  timestamp: Date
  rating: Rating
  guideStep?: string
}

export interface ItemFeedbackOverview {
  id: string
  upvotes: number
  downvotes: number
  ratingPercentage: number
  title: string
  link?: string
  totalMessages: number
  from: 'guide' | 'codeExample'

  // Ordered in descending order
  feed: FeedEntry[]
  // Ordered in descending order
  ratings: UserRating[]
  // Ordered in descending order
  userMessages: UserMessage[]
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

function removeNearestItemForAnchors<T>({
  items,
  isAnchor,
  shouldRemove,
}: {
  items: T[],
  isAnchor: (item: T) => boolean,
  shouldRemove: (item: T, anchor: T) => boolean,
}) {
  for (let i = items.length - 1; i >= 0; i--) {
    const anchor = items[i]

    if (!isAnchor(anchor)) continue

    let wasItemRemoved = false
    for (let j = i; j >= 0; j--) {
      const item = items[j]
      if (shouldRemove(item, anchor)) {
        items.splice(j, 1)
        wasItemRemoved = true
        i--
        break
      }
    }

    if (wasItemRemoved) {
      continue
    }

    for (let j = i; j < items.length; j++) {
      const item = items[j]
      if (shouldRemove(item, anchor)) {
        items.splice(j, 1)
        break
      }
    }
  }
}

export function aggregateFeedbackBy(by: 'guides' | 'codeExamples', feedback: Required<apps_feedback>[]) {
  const key = by === 'guides' ? 'guide' : 'codeExamplePath'

  const items = feedback.reduce<({ [id: string]: ItemFeedbackOverview })>((prev, curr) => {
    const properties = curr.properties as AppFeedbackPropertiesJSON
    if (!properties) return prev

    const val = properties[key]?.split(/[?#]/)[0]
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
        id: val,
        title: by === 'guides' ? getGuideName(val) : properties.codeExampleTitle!,
        totalMessages: 0,
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
        guideStep: properties.guideStep,
        email: properties.email,
      })
      item.totalMessages += 1
    } else if (properties.rating === Rating.Upvote) {
      item.upvotes += 1
      item.ratings.push({
        rating: properties.rating,
        timestamp: new Date(curr.created_at),
        userID: properties.userId || properties.anonymousId!,
        guideStep: properties.guideStep,
      })
    } else if (properties.rating === Rating.Downvote) {
      item.downvotes += 1
      item.ratings.push({
        rating: properties.rating,
        timestamp: new Date(curr.created_at),
        userID: properties.userId || properties.anonymousId!,
        guideStep: properties.guideStep,
      })
    }

    return prev
  }, {})

  const timeNow = new Date().getTime()

  Object.values(items).forEach(item => {
    if (!item.downvotes && !item.upvotes) {
      // If there are no downvotes and upvotes the rating % doesn't make sense.
    } else if (!item.downvotes) {
      item.ratingPercentage = 1
    } else if (!item.upvotes) {
      item.ratingPercentage = 0
    } else {
      item.ratingPercentage = item.upvotes / (item.upvotes + item.downvotes)
    }

    item.ratings.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    item.userMessages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

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

    // For each feed entry with email (anchor) remove the nearest matching feed entry with message and rating (preferring entries with smaller timestamp). 
    removeNearestItemForAnchors({
      items: item.feed,
      isAnchor: e => !!('email' in e && e.email),
      shouldRemove: (entry, anchor) =>
        entry.userID === anchor.userID &&
        entry.rating === entry.rating &&
        'text' in entry &&
        'text' in anchor &&
        entry.text === anchor.text &&
        !('email' in entry && entry.email),
    })

    // For each feed entry with message (anchor) remove the nearest matching feed entry with just rating (preferring entries with smaller timestamp). 
    removeNearestItemForAnchors({
      items: item.feed,
      isAnchor: e => !!('text' in e && e.text),
      shouldRemove: (entry, anchor) =>
        entry.userID === anchor.userID &&
        entry.rating === anchor.rating &&
        !('text' in entry && entry.text),
    })
  })

  return Object.values(items)
}

export function calculateTotalRating(feedback?: ItemFeedbackOverview[]) {
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