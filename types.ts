import type { components, EnvVars } from '@devbookhq/sdk'

export interface UserFeedback {
  user_id: string
  created_at: string
  feedback: string
}

export interface ErrorRes {
  statusCode: number
  message: string
}

export type CodeSnippetUpdate = Pick<CodeSnippet, 'id'> & Partial<Pick<CodeSnippet, 'code' | 'title' | 'env_vars'>>

export type Language = components['schemas']['Template']

// Used when creating a new code snippet.
export interface CodeSnippet {
  id: string
  created_at: Date | string // Date string
  title: string
  creator_id: string
  code?: string
  env_vars: EnvVars
  template: Language
}

export interface PublishedCodeSnippet {
  // When creating a new published code snippet, the ID and published date is generated automatically.
  id?: string
  published_at?: Date
  code_snippet_id: string
  title: string
  code: string
  env_vars: EnvVars
  template: Language
}

export interface CodeEnvironment {
  id: string
  code_snippet_id: string
  template: Language
  deps: string[]
  state: 'None' | components['schemas']['EnvironmentState']
}

export interface Template {
  name: string
  value: Language
}
