import { createClient } from '@supabase/supabase-js'

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin priviliges and overwrites RLS policies!
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export async function getAPIKeyInfo(apiKey: string) {
  const { data, error } = await supabaseAdmin
    .from<{ api_key: string, owner_id: string }>('api_keys')
    .select('*')
    .eq('api_key', apiKey)

  if (error) throw error
  return data && data.length ? data[0] : null
}
