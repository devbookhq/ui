import {
  createClient,
} from '@supabase/supabase-js'

import type {
  CodeEnvironment,
  CodeSnippet,
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

async function registerEnvJob({
  codeSnippetID,
  template,
}: {
  codeSnippetID: string,
  template: string,
}) {
  const api = 'https://ondevbook.com'
  const body = JSON.stringify({ codeSnippetID, template: 'nodejs', deps: [], })

  fetch(`${api}/envs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  })
  .then(response => {
    console.log(response.status)
    return response.json()
  })
  .then((data: any) => {
    console.log(data)
  })
  .catch(err => {
    console.error(err)
  })
}

export {
  upsertCodeSnippet,
  registerEnvJob,
  upsertEnv,
}
