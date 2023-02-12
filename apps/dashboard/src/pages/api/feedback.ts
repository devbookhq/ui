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
import { getGuideName } from 'feedback'


function getRatingEmoji(feedback: AppFeedback, label?: boolean) {
  if (feedback.properties.rating === 'down') {
    return (label ? 'Downvote ' : '') + ':-1:'
  }
  if (feedback.properties.rating === 'up') {
    return (label ? 'Upvote ' : '') + ':+1:'
  }
}

function getTitle(feedback: AppFeedback) {
  let type: string
  if (feedback.properties.guide) {
    type = 'guide'
  } else if (feedback.properties.codeExamplePath) {
    type = 'code example'
  } else {
    throw new Error('Cannot get title from feedback: unknown feedback type')
  }

  if (feedback.properties.email) {
    return `User left email for ${type} feedback`
  }
  if (feedback.feedback) {
    return `User left message for ${type}`
  }
  if (feedback.properties.rating === 'down') {
    return `Negative rating for ${type}`
  }
  if (feedback.properties.rating === 'up') {
    return `Positive rating for ${type}`
  }
  return ''
}

function createCodeExampleFeedbackMessage(feedback: AppFeedback) {
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
          'text': `*Code Example*\n<https://playground.prisma.io${feedback.properties.codeExamplePath}|${feedback.properties.codeExampleTitle}>`
        },
        {
          // Without this Slack is still displaying the message correctly, but it also displays incorrect notification about not being able to display content.
          text: ' ',
          type: 'plain_text',
        }
      ],
    }
  ]

  if (feedback.properties.email) {
    blocks.push(
      {
        'type': 'section',
        'text': {
          'text': `*Email*\n\`\`\`${feedback.properties.email}\`\`\``,
          'type': 'mrkdwn',
        }
      },
    )
  }

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
              } the code example`,
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

function createGuideFeedbackMessage(feedback: AppFeedback) {
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
          // Without this Slack is still displaying the message correctly, but it also displays incorrect notification about not being able to display content.
          text: ' ',
          type: 'plain_text',
        }
      ],
    }
  ]

  if (feedback.properties.email) {
    blocks.push(
      {
        'type': 'section',
        'text': {
          'text': `*Email*\n\`\`\`${feedback.properties.email}\`\`\``,
          'type': 'mrkdwn',
        }
      },
    )
  }

  if (feedback.properties.guideStep) {
    try {
      const step = Number(feedback.properties.guideStep) + 1
      blocks.push({
        type: 'section',
        fields: [
          {
            'type': 'mrkdwn',
            'text': `*Step*\n<https://playground.prisma.io${feedback.properties.guide}|${step}>`
          },
        ],
      })
    } catch (err) {
      console.error('Failed to convert guideStep to number', err)
    }
  }

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
      let message: { blocks: (Block | KnownBlock)[] } = { blocks: [] }
      if (feedback.properties.guide) {
        message = createGuideFeedbackMessage(feedback)
      } else if (feedback.properties.codeExamplePath) {
        message = createCodeExampleFeedbackMessage(feedback)
      } else if (feedback.properties.email) {

      } else {
        res.status(400).json({ error: 'Unknown feedback type' })
      }

      if (feedback.properties)
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
