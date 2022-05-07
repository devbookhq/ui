import { createClient } from '@supabase/supabase-js'

const db = createClient(
  SUPABASE_URL, // Replace with your project's URL
  SUPABASE_ANON_KEY, // Replace with your project's anon/service_role key
  {
    fetch: fetch.bind(globalThis), // Tell Supabase Client to use Cloudflare Workers' global `fetch` API to make requests
  }
)


// TODO: Get CS from Supabase
// TODO: Update the script
// TODO: Return script

const script = `
  import Devbook from '@devbookhq/sdk'
`


export async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url)
  // `pathname` should be an ID of a code snippet
  const { pathname } = url

  const { data, error } = await db.from('code_snippets').select('*').eq('id', pathname)


  return new Response(`request method: ${request.method}`)
}
