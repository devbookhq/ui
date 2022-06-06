import { createClient } from '@supabase/supabase-js'

const codeSnippetIDScriptPlaceholder = '<<DBK_CODE_SNIPPET_ID>>'
const codeSnippetCodeScriptPlaceholder = '<<DBK_CODE_SNIPPET_CODE>>'

function escapeBacktics(str: string) {
  return str.replace(/`/g, '\\`')
}

const db = createClient(
  SUPABASE_URL, // Replace with your project's URL
  SUPABASE_ANON_KEY, // Replace with your project's anon/service_role key
  {
    fetch: fetch.bind(globalThis), // Tell Supabase Client to use Cloudflare Workers' global `fetch` API to make requests
  }
)

// load from fs/import as a string after it is built, before deploy
const scriptTemplate = ''

function getScriptContent(codeSnippetID: string, codeSnippetCode: string) {
  return scriptTemplate
    .replace(codeSnippetIDScriptPlaceholder, escapeBacktics(codeSnippetID))
    .replace(codeSnippetCodeScriptPlaceholder, escapeBacktics(codeSnippetCode))
}

export async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url)
  console.log({ p: url.pathname })
  // `pathname` should be in the format of '/embed/:codeSnippetID'
  const splits = url.pathname.split('/') // ['', 'embed', :codeSnippetID]
  const codeSnippetID = (splits.length && splits.length == 3) ? splits[2] : ''

  const { data, error } = await db
    .from('code_snippets')
    .select('code')
    .eq('code_snippet_id', codeSnippetID)
    .order('published_at')
    .limit(1)
    .single()

  if (error) {
    console.error(error)
    return new Response(error.message || error.toString(), {
      status: 500,
    })
  }

  const codeSnippetCode = data.code as string
  const scriptContent = getScriptContent(codeSnippetID, codeSnippetCode)

  return new Response(JSON.stringify(scriptContent), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
