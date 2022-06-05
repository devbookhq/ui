import {
  supabaseClient,
} from '@supabase/supabase-auth-helpers/nextjs'

import {
  PublishedCodeSnippet,
  CodeSnippet,
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

async function upsertCodeSnippet(cs: CodeSnippet) {
  const response = await fetch('/api/code', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(cs)
  })
  return response.json()
}


export {
  getPublishedCodeSnippet,
  upsertPublishedCodeSnippet,
  upsertCodeSnippet,
}
