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
} from 'types'

import {
  upsertCodeSnippet,
} from 'utils/supabaseAdmin'

interface ErrorRes {
  statusCode: number
  message: string
}

async function createCodeItem(req: NextApiRequest, res: NextApiResponse<CodeSnippet | ErrorRes>) {
  try {
    let { title }: {
      // TODO: Runtime
      title: string,
    } = JSON.parse(req.body)
    // TODO: Frontend might send code item's title.
    const { user } = await getUser({ req, res })
    if (!user) throw new Error('could not get user')

    const id = randomstring.generate({ length: 12, charset: 'alphanumeric' })
    if (!title) {
      title = dockerNames.getRandomName().replace('_', '-')
    }
    const slug = `${title}-${id}`

    const codeSnippet: CodeSnippet = {
      id,
      title,
      slug,
      creator_id: user.id,
      code: '',
    }
    await upsertCodeSnippet(codeSnippet)


    //await upsertEnv(codeSnippet)

    res.status(200).json(codeSnippet)
  } catch (err: any) {
    console.log(err)
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
    console.log(err)
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}

export default withAuthRequired(async (req, res) => {
  if (req.method === 'PUT') {
    await createCodeItem(req, res)
  } else if (req.method === 'POST') {
    await updateCodeItem(req, res)
  } else {
    res.setHeader('Allow', 'PUT, POST, DELETE')
    res.status(405).end('Method Not Allowed')
  }
})
