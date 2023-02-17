import { KnownBlock, Block } from '@slack/bolt'

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

export function createCodeExampleFeedbackMessage(feedback: AppFeedback, host: string) {
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
          'text': `*Code Example*\n<${host}${feedback.properties.codeExamplePath}|${feedback.properties.codeExampleTitle}>`
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

export function createPrismaGuideFeedbackMessage(feedback: AppFeedback) {
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