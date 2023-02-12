import { NextApiRequest, NextApiResponse } from 'next'
import { apps_content } from 'database'

import { appsContentTable } from 'queries/db'
import { hiddenAppRoute } from 'utils/constants'
import { prisma } from 'queries/prisma'

enum SupabaseEventType {
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  INSERT = 'INSERT',
}

interface SupabaseTrigger {
  type: SupabaseEventType
  table: string
  record: apps_content
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res
      .status(405)
      .json({ error: 'Sorry! This endpoint does not accept your requests.' })
    return
  }

  if (req.query.secret !== process.env.SUPABASE_WEBHOOK_SECRET) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  const change = req.body as SupabaseTrigger
  if (change.table === appsContentTable) {

    const app = await prisma.apps.findUniqueOrThrow({
      where: {
        id: change.record.app_id,
      },
    })

    if (!app.subdomain) {
      throw new Error('App is not deployed on any subdomain')
    }

    try {
      const appPath = `/${hiddenAppRoute}/${app.subdomain}`
      await res.revalidate(appPath)
      return res.status(200).json({ message: 'OK' })
    } catch (err) {
      return res.status(500).json({ error: 'Error revalidating' })
    }
  }
}
