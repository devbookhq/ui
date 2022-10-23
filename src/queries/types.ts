import { RootState } from 'core/EditorProvider/models/RootStoreProvider'

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
  creator_id?: string
  created_at?: number
  state: RootState
}

export interface DeployedApp {
  id?: string
  created_at?: number
  state: RootState
  app_id: string
}
