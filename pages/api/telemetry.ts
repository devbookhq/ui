import { NextApiRequest, NextApiResponse } from 'next'

import { CodeSnippetEmbedTelemetryType } from 'types'
import { allowCors } from 'utils/api'
import {
  upsertCodeSnippetEmbedTelemetry,
} from 'utils/supabaseAdmin'

async function codeEmbedTelemetry(req: NextApiRequest, res: NextApiResponse) {
  const { codeSnippetID, host, path, type } = req.body as {
    codeSnippetID: string
    host: string
    path: string
    type: CodeSnippetEmbedTelemetryType
  }

  if (!type) {
    res.status(400).json({ statusCode: 400, message: 'Missing telemetry type' })
    return
  }

  if (!codeSnippetID) {
    const err = new Error('Missing code snippet ID')
    console.error(err)
    res.status(400).json({ statusCode: 400, message: err.message })
    return
  }

  try {
    await upsertCodeSnippetEmbedTelemetry({ codeSnippetID, host, path, type })
    res.status(200).send('')
  } catch(err: any) {
    console.error(err)
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'PUT') {
    res.setHeader('Allow', 'PUT')
    res.status(405).json({ statusCode: 405, message: 'Method Not Allowed' })
    return
  }
  await codeEmbedTelemetry(req, res)
}

export default allowCors(handler)
