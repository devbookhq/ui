import { NextApiRequest, NextApiResponse } from 'next'

import { allowCors } from 'utils/api'
import {
  upsertCodeSnippetEmbedRun,
} from 'utils/supabaseAdmin'

enum TelemetryType {
  RunCodeEmbed = 'runCodeEmbed',
}

async function runCodeEmbedTelemetry(req: NextApiRequest, res: NextApiResponse) {
  const { codeSnippetID, host, path } = req.body as {
    codeSnippetID: string
    host: string
    path: string
  }

  if (!codeSnippetID) {
    const err = new Error('Missing code snippet ID')
    console.error(err)
    res.status(400).json({ statusCode: 400, message: err.message })
    return
  }

  try {
    await upsertCodeSnippetEmbedRun({ codeSnippetID, host, path })
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

  const { type } = req.body as { type: TelemetryType }
  if (type === TelemetryType.RunCodeEmbed) {
    await runCodeEmbedTelemetry(req, res)
  }
}

export default allowCors(handler)
