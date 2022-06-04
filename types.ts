import type { components } from '@devbookhq/sdk'

export interface CodeSnippet {
  id: string
  title: string
  /////////////// REMOVE? ///////////////////////////
  slug: string
  //////////////////////////////////////////////////
  creator_id: string
  code?: string
}

export interface PublishedCodeSnippet {
  // When creating a new published code snippet, the ID and published date is generated automatically.
  id?: string
  published_at?: Date
  code_snippet_id: string
  title: string
  code: string
}

export interface CodeEnvironment {
  id: string
  code_snippet_id: string
  template: components['schemas']['Template']
  deps: string[]
  state: 'None' | components['schemas']['EnvironmentState']
}

export interface Template {
  name: string
  value: components['schemas']['Template']
}
