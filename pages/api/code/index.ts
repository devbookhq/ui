import type {
  NextApiRequest,
  NextApiResponse,
} from 'next'
import {
  getUser,
} from '@supabase/supabase-auth-helpers/nextjs'
import randomstring from 'randomstring'
// docker-names pkg doesn't have types
const dockerNames = require('docker-names')

import type {
  CodeSnippet,
  CodeEnvironment,
  Template,
} from 'types'
import {
  getAPIKeyInfo,
  upsertCodeSnippet,
  upsertEnv,
  deleteCodeSnippet,
  deletePublishedCodeSnippet,
  createEnvJob,
  deleteEnvJob,
} from 'utils/supabaseAdmin'

interface ErrorRes {
  statusCode: number
  message: string
}

async function validateAPIKey(apiKey?: string) {
  if (!apiKey) throw new Error('API key not specified')
  const data = await getAPIKeyInfo(apiKey)
  if (!data) throw new Error('Failed to retrieve the API key owner')
  return data.owner_id
}

async function createCodeItem(req: NextApiRequest, res: NextApiResponse<CodeSnippet | ErrorRes>) {
  try {
    const { apiKey }: { apiKey: string } = req.body
    const userID = await validateAPIKey(apiKey)

    let {
      template,
      title,
      deps,
    }: {
      template: Template['value'],
      title: string,
      deps?: string[],
    } = req.body

    const csID = randomstring.generate({ length: 12, charset: 'alphanumeric' })
    if (!title) title = dockerNames.getRandomName().replace('_', '-')
    const slug = `${title}-${csID}`

    const codeSnippet: CodeSnippet = {
      id: csID,
      title,
      slug,
      creator_id: userID,
      code: '',
    }

    await upsertCodeSnippet(codeSnippet)

    const envID = randomstring.generate({ length: 12, charset: 'alphanumeric' })
    const env: CodeEnvironment = {
      id: envID,
      code_snippet_id: csID,
      template,
      deps: deps ?? [],
      state: 'None',
    }
    await upsertEnv(env)
    await createEnvJob({
      codeSnippetID: codeSnippet.id,
      template,
      deps: [],
      api_key: apiKey,
    })

    res.status(200).json(codeSnippet)
  } catch (err: any) {
    console.error(err)
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}

async function updateCodeItem(req: NextApiRequest, res: NextApiResponse<CodeSnippet | ErrorRes>) {
  try {
    const { apiKey }: { apiKey: string } = req.body
    const userID = await validateAPIKey(apiKey)

    const cs = req.body as CodeSnippet
    if (userID !== cs.creator_id) {
      res.status(405).end('Not allowed - user does not have write access')
      return
    }

    await upsertCodeSnippet(cs)
    res.status(200).json(cs)
  } catch (err: any) {
    console.error(err)
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}

async function deleteCodeItem(req: NextApiRequest, res: NextApiResponse<ErrorRes | { codeSnippetID: string }>) {
  try {
    // Before we delete a code_snippet, we have to delete a code snippet's environment.
    // Then we need to register a Nomad job that deletes an environment files.
    const {
      codeSnippetID,
      apiKey,
    } = req.body as { codeSnippetID: string, apiKey: string }
    await validateAPIKey(apiKey)

    await deleteEnvJob({ codeSnippetID, api_key: apiKey })
    await deletePublishedCodeSnippet(codeSnippetID)
    await deleteCodeSnippet(codeSnippetID)

    res.status(200).json({ codeSnippetID })
  } catch (err: any) {
    console.error(err)
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'PUT') {
    await createCodeItem(req, res)
  } else if (req.method === 'POST') {
    await updateCodeItem(req, res)
  } else if (req.method === 'DELETE') {
    await deleteCodeItem(req, res)
  } else {
    res.setHeader('Allow', 'PUT, POST, DELETE')
    res.status(405).end('Method Not Allowed')
  }
}
