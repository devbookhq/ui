export interface CodeSnippet {
  id: string
  title: string
  slug: string
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
  template: 'Nodejs'
  deps: string[]
  state: 'None' | 'Building' | 'Failed' | 'Done'
}

export interface Template {
  name: string
  value: string
}
