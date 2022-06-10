import {
  supabaseClient,
} from '@supabase/supabase-auth-helpers/nextjs'

import {
  PublishedCodeSnippet,
  CodeSnippet,
  ErrorRes,
  NewCodeSnippet,
} from 'types'

function getPublishedCodeSnippet(codeSnippetID: string) {
  return supabaseClient
    .from<PublishedCodeSnippet>('published_code_snippets')
    .select('*')
    .eq('code_snippet_id', codeSnippetID)
}

async function upsertPublishedCodeSnippet(cs: PublishedCodeSnippet) {
  const { body, error } = await supabaseClient
    .from<PublishedCodeSnippet>('published_code_snippets')
    .upsert(cs)
  if (error) throw error
  return body[0]
}

async function updateCodeSnippet(codeSnippet: CodeSnippet, apiKey: string) {
  const response = await fetch('/api/code', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      apiKey,
      codeSnippet,
    }),
  })
  return response.json()
}

async function createCodeSnippet(codeSnippet: NewCodeSnippet, apiKey: string) {
  const response = await fetch('/api/code', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      apiKey,
      codeSnippet,
    }),
  })
  return response.json() as Promise<CodeSnippet | ErrorRes>
}


export {
  getPublishedCodeSnippet,
  upsertPublishedCodeSnippet,
  updateCodeSnippet,
  createCodeSnippet
}
