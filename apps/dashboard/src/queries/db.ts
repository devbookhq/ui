import type { Installation } from '@slack/oauth'

export const appsFeedbackTable = 'apps_feedback'
export const slackInstallationsTable = 'slack_installations'
export const appsTable = 'apps'
export const appsContentTable = 'apps_content'
export const userFeedbackTable = 'user_feedback'

export interface UserFeedback {
  user_id: string
  created_at: string
  feedback: string
}

export enum Rating {
  Upvote = 'up',
  Downvote = 'down',
}

export interface AppFeedbackPropertiesJSON {
  userId?: string
  anonymousId?: string
  rating?: Rating
  guide?: string
  guideStep?: string
}

export interface AppFeedback {
  appId: string
  feedback?: string
  created_at?: string
  properties: AppFeedbackPropertiesJSON
}

export interface InstallationDBEntry {
  id: string
  created_at?: Date
  devbook_app_id?: string
  installation_data: Installation
}
