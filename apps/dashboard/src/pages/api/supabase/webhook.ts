import { NextApiRequest, NextApiResponse } from 'next'

import { guidesTable } from 'queries/db'
import { Database } from 'queries/supabase'

enum SupabaseEventType {
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  INSERT = 'INSERT',
}

interface SupabaseTrigger {
  type: SupabaseEventType
  table: string
  record: Database['public']['Tables']['guides']['Row']
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

  if (change.table === guidesTable) {
    try {
      // TODO: Should we call the revalidate on the original path?
      const guidePath = `/_sites/${change.record.project_id}/${change.record.slug}`

      await res.revalidate(guidePath)
      return res.status(200).json({ message: 'OK' })
    } catch (err) {
      return res.status(500).json({ error: 'Error revalidating' })
    }
  }
}
