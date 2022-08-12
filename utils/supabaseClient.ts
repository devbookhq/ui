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
  CodeSnippetEmbedTelemetryType,
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

async function getEmbedsTelemetry(creatorID: string, actionType?: CodeSnippetEmbedTelemetryType) {
  let query = supabaseClient
    .from('code_snippet_embed_telemetry')
    .select(`
      type,
      created_at,
      code_snippet:code_snippet_id (
        id,
        title,
        creator_id
      )
    `)
    .eq('code_snippet.creator_id', creatorID)
  if (actionType) {
    query = query.eq('type', actionType)
  }

  const { body, error } = await query
  if (error) throw error
  return body.filter((el: any) => el.code_snippet !== null)
}

export {
  getPublishedCodeSnippet,
  upsertPublishedCodeSnippet,
  updateCodeSnippet,
  createCodeSnippet,
  upsertUserFeedback,
  getEmbedsTelemetry,
}
