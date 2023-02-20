import { NextApiRequest, NextApiResponse } from 'next'
import { IncomingWebhook } from '@slack/webhook'
import { KnownBlock, Block } from '@slack/bolt'

import { allowCors } from 'utils/api'
import {
  supabaseAdmin,
  saveAppFeedback,
  getInstallationsByAppID,
} from 'queries/admin'
import {
  AppFeedback,
} from 'queries/db'

import {
  createCodeExampleFeedbackMessage,
  createPrismaGuideFeedbackMessage,
} from 'utils/slackMessage'


async function appFeedback(req: NextApiRequest, res: NextApiResponse) {
  const feedback = JSON.parse(req.body) as AppFeedback
  try {
    await saveAppFeedback(supabaseAdmin, feedback)
    const installations = await getInstallationsByAppID(supabaseAdmin, feedback.appId)
    if (installations.length === 0) {
      res.status(200).send('')
      return
    }

    let message: { blocks: (Block | KnownBlock)[] } = { blocks: [] }

    if (feedback.appId === 'prisma-hub') {
      if (feedback.properties.guide) {
        message = createPrismaGuideFeedbackMessage(feedback)
      } else if (feedback.properties.codeExamplePath) {
        message = createCodeExampleFeedbackMessage(feedback, 'https://playground.prisma.io')
      } else {
        res.status(400).json({ error: 'Unknown feedback type for Prisma' })
      }
    } else {
      // Handle Proxyrack and all others
      message = createCodeExampleFeedbackMessage(feedback, 'https://proxyrack.usedevbook.com')
    }

    // Send the message to all installations (= channels).
    await Promise.all(installations.map(async i => {
      const url = i.installation_data.incomingWebhook?.url
      if (!url) return
      const webhook = new IncomingWebhook(url)
      try {
        await webhook.send(message)
      } catch (err) {
        console.error(`Cannot send message from Devbook app "${feedback.appId}" to Slack installation "${i.id}":`, err)
      }
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
