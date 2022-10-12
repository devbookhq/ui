import { BoardBlock } from 'components/BuilderProvider/boardBlock'

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
  serialized: {
    blocks?: BoardBlock[]
  }
}
