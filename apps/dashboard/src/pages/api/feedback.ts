import { NextApiRequest, NextApiResponse } from 'next'
import { IncomingWebhook } from '@slack/webhook'
import { KnownBlock, Block } from '@slack/bolt'

import { allowCors } from 'utils/api'
import {
  supabaseAdmin,
  saveAppFeedback,
  getInstallationsByAppID,
} from 'queries/supabaseAdmin'
import { AppFeedback } from "queries/AppFeedback"
import { getGuideName } from 'utils/analytics'


function getRatingEmoji(feedback: AppFeedback, label?: boolean) {
  if (feedback.properties.rating === 'down') {
    return (label ? 'Downvote ' : '') + ':-1:'
  }
  if (feedback.properties.rating === 'up') {
    return (label ? 'Upvote ' : '') + ':+1:'
  }
}

function getTitle(feedback: AppFeedback) {
  if (feedback.feedback) {
    return 'User left message for guide'
  }
  if (feedback.properties.rating === 'down') {
    return 'Negative rating for guide'
  }
  if (feedback.properties.rating === 'up') {
    return 'Positive rating for guide'
  }
  return ''
}


function createFeedbackMessage(feedback: AppFeedback) {
  const blocks: (Block | KnownBlock)[] = [
    {
      'type': 'header',
      'text': {
        'type': 'plain_text',
        'text': getTitle(feedback),
      }
    },
    {
      type: 'section',
      fields: [
        {
          'type': 'mrkdwn',
          'text': `*Guide*\n<https://playground.prisma.io${feedback.properties.guide}|${getGuideName(feedback.properties.guide || '')}>`
        },
        {
          // Without this the Slack is still displaying the message correctly, but it also displays incorrect notification about not being able to display content.
          text: ' ',
          type: 'plain_text',
        }
      ],
    }
  ]

  if (feedback.feedback) {
    blocks.push(
      {
        'type': 'section',
        'text': {
          'text': `*Message left by user*\n\`\`\`${feedback.feedback.replaceAll('`', '\\`')}\`\`\``,
          'type': 'mrkdwn',
        }
      },
      {
        'type': 'context',
        'elements': [
          {
            'type': 'mrkdwn',
            'text': `Made by user with ID \`${feedback.properties.userId || feedback.properties.anonymousId}\``
          },
          {
            'type': 'mrkdwn',
            'text': `This user previously ${feedback.properties.rating === 'down' ? '*downvoted* :-1:' : '*upvoted* :+1:'
              } the guide`,
          },
        ]
      },
      {
        'type': 'divider'
      },
    )
  } else {
    blocks.push(
      {
        'type': 'section',
        'text': {
          'type': 'mrkdwn',
          'text': `*Rating left by user* \n${getRatingEmoji(feedback, true)}`
        },
      },
      {
        'type': 'context',
        'elements': [
          {
            'type': 'mrkdwn',
            'text': `Made by user with ID \`${feedback.properties.userId || feedback.properties.anonymousId}\``
          },
        ]
      },
    )
  }

  return { blocks }
}

async function appFeedback(req: NextApiRequest, res: NextApiResponse) {
  const feedback = JSON.parse(req.body) as AppFeedback
  try {
    await saveAppFeedback(supabaseAdmin, feedback)
    const installations = await getInstallationsByAppID(supabaseAdmin, feedback.appId)

    if (installations.length > 0) {
      const message = createFeedbackMessage(feedback)
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
    }

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
