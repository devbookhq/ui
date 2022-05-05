import type {
  NextApiRequest,
  NextApiResponse,
} from 'next'
import {
  getUser,
  withAuthRequired,
} from '@supabase/supabase-auth-helpers/nextjs'
import randomstring from 'randomstring'
import dockerNames from 'docker-names'

import type {
  CodeSnippet,
} from 'types'

import {
  upsertCodeSnippet,
} from 'utils/supabaseAdmin'

interface Data {
  id: string
  title: string
  slug: string
  code: string
  creator_id: string
}

async function createCodeItem(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    const { user } = await getUser({ req, res })
    if (!user) throw Error('Could not get user')

    const id = randomstring.generate({ length: 12, charset: 'alphanumeric' })
    const title = dockerNames.getRandomName().replace('_', '-')
    const slug = `${title}-${id}`

    const codeSnippet: CodeSnippet = {
      id,
      title,
      slug,
      creator_id: user.id,
      code: '',
    }
    await upsertCodeSnippet(codeSnippet)

    res.status(200).json({ codeSnippet })
  } catch (err: any) {
    console.log(err)
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}

async function updateCodeItem(req: NextApiRequest, res: NextApiResponse<Data>) {
  res.status(200).json({ todo: 'todo', })
}

export default withAuthRequired(async (req, res) => {
  if (req.method === 'PUT') {
    await createCodeItem(req, res)
  } else if (req.method === 'POST') {
    await updateCodeItem(req, res)
  } else {
    res.setHeader('Allow', 'PUT, POST')
    res.status(405).end('Method Not Allowed')
  }
})
