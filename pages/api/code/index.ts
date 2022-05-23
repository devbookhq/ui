import type {
  NextApiRequest,
  NextApiResponse,
} from 'next'
import {
  getUser,
  withAuthRequired,
} from '@supabase/supabase-auth-helpers/nextjs'
import randomstring from 'randomstring'
// docker-names pkg doesn't have types
const dockerNames: any = require('docker-names')


import type {
  CodeSnippet,
  CodeEnvironment,
} from 'types'
import {
  upsertCodeSnippet,
  upsertEnv,
  registerEnvJob,
  deleteCodeSnippet,
  deleteEnv,
} from 'utils/supabaseAdmin'

interface ErrorRes {
  statusCode: number
  message: string
}

async function createCodeItem(req: NextApiRequest, res: NextApiResponse<CodeSnippet | ErrorRes>) {
  try {
    const { user } = await getUser({ req, res })
    if (!user) throw new Error('could not get user')

    let { template, title }: {
      template: string,
      title: string,
    } = req.body

    const csID = randomstring.generate({ length: 12, charset: 'alphanumeric' })
    if (!title) title = dockerNames.getRandomName().replace('_', '-')
    const slug = `${title}-${csID}`

    const codeSnippet: CodeSnippet = {
      id: csID,
      title,
      slug,
      creator_id: user.id,
      code: '',
    }

    await upsertCodeSnippet(codeSnippet)

    const envID = randomstring.generate({ length: 12, charset: 'alphanumeric' })
    const env: CodeEnvironment = {
      id: envID,
      code_snippet_id: csID,
      template: 'Nodejs',
      deps: [],
      state: 'None',
    }
    await upsertEnv(env)
    await registerEnvJob({ codeSnippetID: codeSnippet.id, template })

    res.status(200).json(codeSnippet)
  } catch (err: any) {
    console.error(err)
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}

async function updateCodeItem(req: NextApiRequest, res: NextApiResponse<CodeSnippet | ErrorRes>) {
  try {
    const cs = req.body as CodeSnippet
    const { user } = await getUser({ req, res })
    if (!user) throw new Error('could not get user')

    if (user.id !== cs.creator_id) {
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
    const { codeSnippetID } = req.body as { codeSnippetID: string }
    await deleteEnv({ codeSnippetID })
    await deleteCodeSnippet(codeSnippetID)

    res.status(200).json({ codeSnippetID })
  } catch (err: any) {
    console.error(err)
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}

export default withAuthRequired(async (req, res) => {
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
})
