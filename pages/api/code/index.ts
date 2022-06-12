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
} from 'utils/api'

type Env = Pick<CodeEnvironment, 'template' | 'deps'>

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
  apiKey: string
  userID: string,
  isPublished: boolean,
  env?: Env,
  newCS: { id: string, title?: string, code?: string },
  originalCS: CodeSnippet,
}) {
  const {
    apiKey,
    userID,
    isPublished,
    newCS,
    originalCS,
    env,
  } = params

  const updatedCS: CodeSnippet = {
    id: originalCS.id,
    // Code snippet cannot be without title.
    title: newCS.title || originalCS.title,
    creator_id: userID,
    code: newCS.code,
    created_at: originalCS.created_at,
  }
  const p: Promise<any>[] = [upsertCodeSnippet(updatedCS)]

  if (isPublished) {
    const pcs: PublishedCodeSnippet = {
      code_snippet_id: updatedCS.id,
      title: updatedCS.title,
      code: updatedCS.code || '',
    }
    p.push(
      upsertPublishedCodeSnippet(pcs)
    )
  } else {
    p.push(
      deletePublishedCodeSnippet(updatedCS.id)
    )
  }

  await Promise.all(p)
  if (env) {
    await createEnv({
      codeSnippetID: updatedCS.id,
      template: env.template,
      deps: env.deps,
      api_key: apiKey,
    })
  }
  return updatedCS
}

async function createCodeSnippet(params: {
  userID: string,
  apiKey: string,
  isPublished: boolean,
  env: Env,
  newCS: { title?: string, code?: string },
}) {
  const {
    userID,
    apiKey,
    isPublished,
    newCS,
    env,
  } = params

  let {
    title = '',
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
  const newEnv: CodeEnvironment = {
    id: envID,
    code_snippet_id: csID,
    template: env.template,
    deps: env.deps,
    state: 'None',
  }

  await upsertCodeSnippet(codeSnippet)
  await upsertEnv(newEnv)
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
    template: env.template,
    deps: env.deps,
    api_key: apiKey,
  })
  return codeSnippet
}

async function createCodeItem(req: NextApiRequest, res: NextApiResponse<CodeSnippet | ErrorRes>) {
  try {
    const {
      apiKey,
      isPublished = false,
      codeSnippet,
      env,
    }: {
      apiKey: string
      codeSnippet: { title?: string, code?: string }
      env: Env,
      isPublished?: boolean
    } = req.body

    let userID: string | undefined
    if (!(userID = await validateAPIKey({ apiKey, res }))) return

    // Creating new code snippet.
    const createdCodeSnippet = await createCodeSnippet({
      userID,
      apiKey,
      isPublished,
      env,
      newCS: codeSnippet,
    })
    res.status(200).json(createdCodeSnippet)
  } catch (err: any) {
    console.error(err)
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}

async function updateCodeItem(req: NextApiRequest, res: NextApiResponse<CodeSnippet | ErrorRes>) {
  try {
    const {
      apiKey,
      isPublished = false,
      codeSnippet,
      env,
    }: {
      apiKey: string
      codeSnippet: { id: string, title?: string, code?: string }
      env?: Env,
      isPublished?: boolean
    } = req.body

    let userID: string | undefined
    if (!(userID = await validateAPIKey({ apiKey, res }))) return

    // First we check if the user has access to the code snippet.
    const originalCS = await getCodeSnippet({ csID: codeSnippet.id, userID })
    if (!originalCS) {
      res.status(404).end(`User '${userID}' doesn't have access to code snippet '${codeSnippet.id}' or it doesn't exist`)
      return
    }

    const updatedCodeSnippet = await updateCodeSnippet({
      apiKey,
      userID,
      isPublished,
      env,
      // TS error here without the `as` clause is wtf since we are checking if `id` is defined above.
      newCS: codeSnippet,
      originalCS,
    })
    res.status(200).json(updatedCodeSnippet)
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
  if (req.method === 'PUT') {
    await createCodeItem(req, res)
  } else if (req.method === 'POST') {
    await updateCodeItem(req, res)
  } else if (req.method === 'DELETE') {
    await deleteCodeItem(req, res)
  } else {
    res.setHeader('Allow', 'PUT, POST, DELETE')
    res.status(405).json({ statusCode: 405, message: 'Method Not Allowed' })
  }
}

export default main
