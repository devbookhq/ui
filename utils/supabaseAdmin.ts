import {
  createClient,
} from '@supabase/supabase-js'
import { api } from '@devbookhq/sdk'

import type {
  CodeEnvironment,
  CodeSnippet,
  PublishedCodeSnippet,
} from 'types'

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin priviliges and overwrites RLS policies!
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

async function upsertCodeSnippet(cs: CodeSnippet) {
  const { error } = await supabaseAdmin
    .from<CodeSnippet>('code_snippets')
    .upsert(cs)

  if (error) throw error
}

async function upsertEnv(env: CodeEnvironment) {
  const { error } = await supabaseAdmin
    .from<CodeEnvironment>('envs')
    .upsert(env)

  if (error) throw error
}

async function deleteCodeSnippet(id: string) {
  const { error } = await supabaseAdmin
    .from<CodeSnippet>('code_snippets')
    .delete()
    .eq('id', id)
  if (error) throw error
}

async function deletePublishedCodeSnippet(codeSnippetID: string) {
  const { error } = await supabaseAdmin
    .from<PublishedCodeSnippet>('published_code_snippets')
    .delete()
    .eq('code_snippet_id', codeSnippetID)
  if (error) throw error
}

const createEnvJob = api.path('/envs/{codeSnippetID}').method('post').create({ api_key: true })
const deleteEnvJob = api.path('/envs/{codeSnippetID}').method('delete').create({ api_key: true })

export {
  upsertCodeSnippet,
  createEnvJob,
  deleteEnvJob,
  upsertEnv,
  deleteCodeSnippet,
  deletePublishedCodeSnippet,
}
