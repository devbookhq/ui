import type {
  NextApiRequest,
  NextApiResponse,
} from 'next'
import randomstring from 'randomstring'
// docker-names pkg doesn't have types
const dockerNames = require('docker-names')

import type {
  ErrorRes,
  CodeSnippet,
  CodeEnvironment,
  NewCodeSnippet,
  PublishedCodeSnippet,
} from 'types'
import {
  getAPIKeyInfo,
  upsertCodeSnippet,
  upsertEnv,
  deleteCodeSnippet,
  deletePublishedCodeSnippet,
  upsertPublishedCodeSnippet,
  getCodeSnippet,
} from 'utils/supabaseAdmin'

import {
  createEnv,
  deleteEnv,
  updateEnv,
} from 'utils/api'

interface NewOrUpdateCodeSnippet extends Omit<CodeSnippet, 'id'> {
  id?: string
}

async function validateAPIKey(params: { res: NextApiResponse, apiKey?: string }) {
  const { res, apiKey } = params
  if (!apiKey) {
    res.status(401).end('Missing API key')
    return
  }
  const data = await getAPIKeyInfo(apiKey)
  if (!data) {
    res.status(401).end('Invalid API key')
    return
  }
  return data.owner_id
}

async function updateCodeSnippet(params: {
  userID: string,
  isPublished: boolean,
  newCS: Partial<CodeSnippet> & { id: string },
  res: NextApiResponse
}) {
  const {
    userID,
    isPublished,
    newCS,
    res,
  } = params

  const cs = await getCodeSnippet({ csID: newCS.id, userID })
  if (!cs) {
    res.status(404).end(`User '${userID}' doesn't have access to code snippet '${newCS.id}' or it doesn't exist`)
    return
  }

  const p = [upsertCodeSnippet(cs)]
  if (isPublished) {
    const pcs: PublishedCodeSnippet = {
      code_snippet_id: cs.id,
      title: cs.title,
      code: cs.code || '',
    }
    p.push(
      upsertPublishedCodeSnippet(pcs)
    )
  } else {
    p.push(
      deletePublishedCodeSnippet(cs.id)
    )
  }
  await Promise.all(p)
  res.status(200).json(cs)
}

async function createCodeSnippet(params: {
  userID: string,
  apiKey: string,
  isPublished: boolean,
  newCS: NewCodeSnippet,
  res: NextApiResponse
}) {
  const {
    userID,
    apiKey,
    isPublished,
    newCS,
    res,
  } = params

  let {
    template,
    title = '',
    deps = [],
    code = '',
  } = newCS

  const csID = randomstring.generate({ length: 12, charset: 'alphanumeric' })
  if (!title) title = dockerNames.getRandomName().replace('_', '-')
  const codeSnippet: CodeSnippet = {
    id: csID,
    title,
    creator_id: userID,
    code,
    created_at: new Date(),
  }

  const envID = randomstring.generate({ length: 12, charset: 'alphanumeric' })
  const env: CodeEnvironment = {
    id: envID,
    code_snippet_id: csID,
    template,
    deps,
    state: 'None',
  }

  await upsertCodeSnippet(codeSnippet)
  await upsertEnv(env)
  if (isPublished) {
    const pcs: PublishedCodeSnippet = {
      code_snippet_id: codeSnippet.id,
      title: codeSnippet.title,
      code: codeSnippet.code || '',
    }
    await upsertPublishedCodeSnippet(pcs)
  }
  await createEnv({
    codeSnippetID: codeSnippet.id,
    template,
    deps,
    api_key: apiKey,
  })

  res.status(200).json(codeSnippet)
}

async function createOrUpdateCodeItem(req: NextApiRequest, res: NextApiResponse<CodeSnippet | ErrorRes>) {
  try {
    const {
      apiKey,
      isPublished = false,
      codeSnippet,
    }: {
      apiKey: string
      codeSnippet: NewCodeSnippet | CodeSnippet
      isPublished?: boolean
    } = req.body

    let userID: string | undefined
    if (!(userID = await validateAPIKey({ apiKey, res }))) return

    if (!(codeSnippet as NewOrUpdateCodeSnippet).id) {
      // Creating new code snippet.
      createCodeSnippet({
        userID,
        apiKey,
        res,
        isPublished,
        newCS: codeSnippet as NewCodeSnippet,
      })
    } else {
      // Updating code snippet.
      updateCodeSnippet({
        userID,
        res,
        isPublished,
        newCS: codeSnippet as Partial<CodeSnippet> & { id: string }
      })
    }
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
    if (!(await validateAPIKey({ apiKey, res }))) return

    await deleteEnv({ codeSnippetID, api_key: apiKey })
    await deletePublishedCodeSnippet(codeSnippetID)
    await deleteCodeSnippet(codeSnippetID)

    res.status(200).json({ codeSnippetID })
  } catch (err: any) {
    console.error(err)
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}

async function main(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    await createOrUpdateCodeItem(req, res)
  } else if (req.method === 'DELETE') {
    await deleteCodeItem(req, res)
  } else {
    res.setHeader('Allow', 'POST, DELETE')
    res.status(405).end('Method Not Allowed')
  }
}

export default main
