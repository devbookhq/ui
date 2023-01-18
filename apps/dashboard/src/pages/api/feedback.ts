import { NextApiRequest, NextApiResponse } from 'next'
import { IncomingWebhook } from '@slack/webhook'
import { KnownBlock, Block } from '@slack/bolt'

import { allowCors } from 'utils/api'
import {
  supabaseAdmin,
  AppFeedback,
  saveAppFeedback,
  getInstallationsByAppID,
} from 'queries/supabaseAdmin'
import { getGuideName } from './slack/_app'

async function appFeedback(req: NextApiRequest, res: NextApiResponse) {
  const feedback = JSON.parse(req.body) as AppFeedback
  try {
    await saveAppFeedback(supabaseAdmin, feedback)
    const installations = await getInstallationsByAppID(supabaseAdmin, feedback.appId)

    await Promise.all(installations.map(async i => {
      const url = i.installation_data.incomingWebhook?.url
      if (!url) return

      const webhook = new IncomingWebhook(url)


      const blocks: (Block | KnownBlock)[] = [
        {
          'type': 'header',
          'text': {
            'type': 'plain_text',
            'text': 'New Feedback',
            'emoji': true
          }
        },
        {
          'type': 'section',
          'fields': [
            {
              'type': 'mrkdwn',
              'text': `*Guide*\n${getGuideName(feedback.properties.guide || '')
                }`
            },
            {
              'type': 'mrkdwn',
              'text': `* Rating *\n${feedback.properties.rating}`
            }
          ]
        }
      ]

      if (feedback.feedback) {
        blocks.push({
          'type': 'section',
          'fields': [
            {
              'type': 'mrkdwn',
              'text': `*Message*\n${feedback.feedback}`
            }
          ]
        })
      }

      await webhook.send({ blocks })
    }))

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
