import { AppFeedback } from 'queries/supabaseAdmin'

interface GuideFeedback {
  upvotes: number
  downvotes: number
  feedback: { userID?: string, text: string, rating?: 'up' | 'down' }[]
}

export function capitalizeFirstLetter(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function getGuideName(guideID: string) {
  return guideID.split('/')[2].split('_').map(capitalizeFirstLetter).join(' ')
}

export function formatGuidesFeedback(feedback: AppFeedback[]) {
  return feedback.reduce<{ [guideID: string]: GuideFeedback }>((prev, curr) => {
    if (!curr.properties.guide) return prev
    let guide = prev[curr.properties.guide]
    if (!guide) {
      guide = { upvotes: 0, downvotes: 0, feedback: [] }
      prev[curr.properties.guide] = guide
    }

    if (curr.feedback) {
      guide.feedback.push({
        rating: curr.properties.rating,
        text: curr.feedback,
        userID: curr.properties.userId || curr.properties.anonymousId,
      })
    } else if (curr.properties.rating === 'up') {
      guide.upvotes += 1
    } else if (curr.properties.rating === 'down') {
      guide.downvotes += 1
    }

    return prev
  }, {})

  // const text = Object
  //   .entries(data)
  //   .map<[string, GuideFeedback]>(([guideID, guideData]) => {
  //     guideData.feedback = guideData.feedback.filter(f => f.text.trim().length > 0)
  //     return [guideID, guideData]
  //   })
  //   .filter(([, guideData]) => guideData.downvotes !== 0 || guideData.upvotes !== 0 || guideData.feedback.length > 0)
  //   .sort(([, g1], [, g2]) => {
  //     return (g1.downvotes + g1.upvotes + g1.feedback.length) - (g2.downvotes + g2.upvotes + g2.feedback.length)
  //   })
  //   .map(([guideID, guideData]) => {
  //     const upvotes = guideData.upvotes > 0 ? `${guideData.upvotes} :thumbsup:` : ''
  //     const downvotes = guideData.downvotes > 0 ? `${guideData.downvotes} :thumbsdown:` : ''
  //     const header = `*${getGuideName(guideID)}* ${upvotes} ${downvotes}`

  //     const userFeedback = guideData.feedback.map(f => `${f.rating === 'down' ? ':thumbsdown:' : ':thumbsup:'}\n${f.text.trim()}`).join('\n\n')
  //     return `### ${header + '\n' + userFeedback}`

  //   }).join('\n\n')
}
