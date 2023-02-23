import { NextApiRequest, NextApiResponse } from 'next'
import { apps_content } from 'database'

import { appsContentTable } from 'queries/db'
import { hiddenAppRoute } from 'utils/constants'
import { prisma } from 'queries/prisma'
import { AppContentJSON } from 'apps/content'

type InsertPayload = {
  type: 'INSERT'
  table: string
  schema: string
  record: apps_content
  old_record: null
}

type UpdatePayload = {
  type: 'UPDATE'
  table: string
  schema: string
  record: apps_content
  old_record: apps_content
}

type DeletePayload = {
  type: 'DELETE'
  table: string
  schema: string
  record: null
  old_record: apps_content
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

  const change = req.body as InsertPayload | UpdatePayload | DeletePayload
  if (change.table === appsContentTable) {
    if (change.type !== 'DELETE') {
      const app = await prisma.apps.findUniqueOrThrow({
        where: {
          id: change.record.app_id,
        },
      })

      if (!app.subdomain) {
        throw new Error('App is not deployed on any subdomain')
      }

      const pages = (change.record.content as unknown as AppContentJSON).mdx.map(m => m.name)
      // We don't currently invalidate old records for updated and deleted apps content
      // const oldPages = change.old_record.content as unknown as AppContentJSON

      try {
        await Promise.all(pages.map(async p => {
          const appPath = p === 'index.mdx'
            ? `/${hiddenAppRoute}/${app.subdomain}`
            : `/${hiddenAppRoute}/${app.subdomain}/${p.split('.').slice(0, -1).join('.')}`

          await res.revalidate(appPath)
        }))
        return res.status(200).json({ message: 'OK' })
      } catch (err) {
        console.error(err)
      }
    }
  }
  return res.status(500).json({ error: 'Error revalidating' })
}
