import { NextApiRequest, NextApiResponse } from 'next'

import { allowCors } from 'utils/api'
import {
  supabaseAdmin,
  saveAppFeedback,
  AppFeedback,
} from 'queries/supabaseAdmin'

async function appFeedback(req: NextApiRequest, res: NextApiResponse) {
  const feedback = req.body as AppFeedback

  try {
    await saveAppFeedback(supabaseAdmin, feedback)
    res.status(200).send('')
  } catch (err: any) {
    console.error(err)
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).json({ statusCode: 405, message: 'Method Not Allowed' })
    return
  }
  await appFeedback(req, res)
}

export default allowCors(handler)
