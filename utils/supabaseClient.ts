import {
  supabaseClient,
} from '@supabase/supabase-auth-helpers/nextjs'

import {
  PublishedCodeSnippet,
  CodeSnippet,
  ErrorRes,
  CodeEnvironment,
  CodeSnippetUpdate,
  UserFeedback,
} from 'types'

type Env = Pick<CodeEnvironment, 'template' | 'deps'>

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

async function upsertUserFeedback(userID: string, feedback: string) {
  const { body, error } = await supabaseClient
    .from<UserFeedback>('user_feedback')
    .upsert({ user_id: userID, feedback })
  if (error) throw error
  return body[0]
}

async function updateCodeSnippet(apiKey: string, codeSnippet: CodeSnippetUpdate, env?: Env) {
  const response = await fetch('/api/code', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      apiKey,
      codeSnippet,
      env,
    }),
  })
  return response.json()
}

async function createCodeSnippet(apiKey: string, codeSnippet: { title?: string, code?: string }, env: Env) {
  const response = await fetch('/api/code', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      apiKey,
      codeSnippet,
      env,
    }),
  })
  return response.json() as Promise<CodeSnippet | ErrorRes>
}

export {
  getPublishedCodeSnippet,
  upsertPublishedCodeSnippet,
  updateCodeSnippet,
  createCodeSnippet,
  upsertUserFeedback,
}
