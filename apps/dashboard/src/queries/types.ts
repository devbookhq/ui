export const appsFeedbackTable = 'apps_feedback'
export const slackInstallationsTable = 'slack_installations'

export interface UserFeedback {
  user_id: string
  created_at: string
  feedback: string
}

export interface ErrorRes {
  statusCode: number
  message: string
}

export interface App {
  id: string
  title: string
  creator_id: string
  created_at: string
  // Temporal ID for identifying analytics sources
  devbook_app_id?: string
}

export enum Rating {
  Upvote = 'up',
  Downvote = 'down',
}

export interface AppFeedback {
  appId: string
  feedback?: string
  created_at?: string
  properties: {
    userId?: string
    anonymousId?: string
    rating?: Rating
    guide?: string
  }
}

export type AppTemplate = Omit<App, 'created_at'>
