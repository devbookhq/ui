import type { Installation } from '@slack/oauth'

export const appsFeedbackTable = 'apps_feedback'
export const slackInstallationsTable = 'slack_installations'
export const appsTable = 'apps'
export const userFeedbackTable = 'user_feedback'
export const guidesTable = 'guides'

export interface UserFeedback {
  user_id: string
  created_at: string
  feedback: string
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

export interface InstallationDBEntry {
  id: string
  created_at?: Date
  devbook_app_id?: string
  installation_data: Installation
}

export interface GuideContentDBENtry {
  env: {
    id: string,
  },
  guide: {
    title: string
  },
  steps: {
    name: string,
    content: string,
  }[],
}

export interface GuideDBEntry {
  id: string
  created_at?: string
  project_id?: string
  path?: string
  subdomain?: string
  content?: GuideContentDBENtry
}
