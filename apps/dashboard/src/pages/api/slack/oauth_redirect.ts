import { NextApiRequest, NextApiResponse } from 'next'

import { appRunner } from 'slack/app'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res
      .status(405)
      .json({ error: 'Sorry! This endpoint does not accept your requests.' })
    return
  }
  await appRunner.handleCallback(req, res)
}
