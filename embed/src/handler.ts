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
  console.log({ p: url.pathname })
  // `pathname` should be in the format of '/embed/:codeSnippetID'
  const splits = url.pathname.split('/') // ['', 'embed', :codeSnippetID]
  const id = (splits.length && splits.length == 3) ? splits[2] : ''

  const { data, error } = await db.from('code_snippets').select('*').eq('id', id)

  if (error) {
    console.error(error)
    return new Response(error.message || error.toString(), {
      status: 500,
    })
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
