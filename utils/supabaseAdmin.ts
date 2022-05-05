import {
  createClient,
} from '@supabase/supabase-js'

import type {
  CodeSnippet,
} from 'types'

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin priviliges and overwrites RLS policies!
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export async function upsertCodeSnippet(cs: CodeSnippet) {
  const { error } = await supabaseAdmin
    .from<CodeSnippet>('code_snippets')
    .upsert(cs)

  if (error) throw error
}
