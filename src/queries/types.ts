import { RootState as AppState } from 'core/BuilderProvider/models/RootStoreProvider'

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
  state: AppState
}
