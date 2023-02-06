export const appFeedbackEndpoint = 'https://app.usedevbook.com/api/feedback'

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
