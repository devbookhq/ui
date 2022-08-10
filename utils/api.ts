import { api } from '@devbookhq/sdk'
import { NextApiRequest, NextApiResponse } from 'next'

const createEnv = api.path('/envs/{codeSnippetID}').method('post').create({ api_key: true })
const deleteEnv = api.path('/envs/{codeSnippetID}').method('delete').create({ api_key: true })
const updateEnv = api.path('/envs/{codeSnippetID}').method('patch').create({ api_key: true })

const allowCors = (fn: any) => async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  return await fn(req, res)
}

export {
  createEnv,
  deleteEnv,
  updateEnv,
  allowCors,
}
