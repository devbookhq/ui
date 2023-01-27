import {
  appID,
  getUser,
} from '.'

const appFeedbackEndpoint = 'https://app.usedevbook.com/api/feedback'

export interface AppFeedback {
  appId: string
  feedback?: string
  properties: {
    userId?: string
    anonymousId?: string
    rating?: 'up' | 'down'
    guide?: string
  }
}

export async function saveUserFeedback(properties: AppFeedback['properties'], feedback?: string) {
  const user = getUser()

  const body: AppFeedback = {
    appId: appID,
    feedback,
    properties: {
      ...user,
      ...properties,
    },
  }

  await fetch(appFeedbackEndpoint, {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    cache: 'no-cache',
    mode: 'no-cors',
    body: JSON.stringify(body),
  })
}
