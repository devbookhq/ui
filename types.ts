export interface CodeSnippet {
  id: string
  title: string
  slug: string
  creator_id: string
  code?: string
}

export interface Runtime {
  name: string
  value: string
}
