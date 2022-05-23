export interface CodeSnippet {
  id: string
  title: string
  slug: string
  creator_id: string
  code?: string
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
