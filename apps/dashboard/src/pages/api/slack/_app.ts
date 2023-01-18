import { App, LogLevel } from '@slack/bolt'
import { ClearStateStore, InstallationStore } from '@slack/oauth'
import { AppRunner } from '@seratch_/bolt-http-runner'
import { deleteInstallation, getInstallation, listAppFeedback, setInstallation, supabaseAdmin } from 'queries/supabaseAdmin'

const installationStore: InstallationStore = {
  storeInstallation: async (installation) => {
    installation.incomingWebhook
    // Bolt will pass your handler an installation object
    // Change the lines below so they save to your database
    if (installation.isEnterpriseInstall && installation.enterprise !== undefined) {
      // handle storing org-wide app installation
      return await setInstallation(supabaseAdmin, installation.enterprise.id, installation.metadata, installation)
    }
    if (installation.team !== undefined) {
      // single team app installation
      return await setInstallation(supabaseAdmin, installation.team.id, installation.metadata, installation)
    }
    throw new Error('Failed saving installation data to installationStore')
  },
  fetchInstallation: async (installQuery) => {
    // Bolt will pass your handler an installQuery object
    // Change the lines below so they fetch from your database
    if (installQuery.isEnterpriseInstall && installQuery.enterpriseId !== undefined) {
      // handle org wide app installation lookup
      const installationDBEntry = await getInstallation(supabaseAdmin, installQuery.enterpriseId)
      return installationDBEntry.installation_data
    }
    if (installQuery.teamId !== undefined) {
      // single team app installation lookup
      const installationDBEntry = await getInstallation(supabaseAdmin, installQuery.teamId)
      return installationDBEntry.installation_data
    }
    throw new Error('Failed fetching installation')
  },
  deleteInstallation: async (installQuery) => {
    // Bolt will pass your handler an installQuery object
    // Change the lines below so they delete from your database
    if (installQuery.isEnterpriseInstall && installQuery.enterpriseId !== undefined) {
      // org wide app installation deletion
      return await deleteInstallation(supabaseAdmin, installQuery.enterpriseId)
    }
    if (installQuery.teamId !== undefined) {
      // single team app installation deletion
      return await deleteInstallation(supabaseAdmin, installQuery.teamId)
    }
    throw new Error('Failed to delete installation')
  },
}

export const appRunner = new AppRunner({
  logLevel: process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : undefined,
  signingSecret: process.env.SLACK_SIGNING_SECRET || '',
  clientId: process.env.SLACK_CLIENT_ID || '',
  clientSecret: process.env.SLACK_CLIENT_SECRET || '',
  scopes: ['incoming-webhook', 'commands'],
  installationStore,
  installerOptions: {
    stateStore: new ClearStateStore(process.env.SLACK_CLIENT_ID || 'dbk'),
    directInstall: true,
    callbackOptions: {
      beforeInstallation: async (opt, req, res) => {
        if (!req.url || !req.headers.host) return false
        const url = new URL('https://' + req.headers.host + req.url)
        const devbookAppID = url.searchParams.get('appId')
        opt.metadata = devbookAppID || undefined
        return true
      },
    },
  },
})

const app = new App(appRunner.appOptions())

interface GuideFeedback {
  upvotes: number
  downvotes: number
  feedback: { userID?: string, text: string, rating?: 'up' | 'down' }[]
}

export function capitalizeFirstLetter(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function getGuideName(guideID: string) {
  return guideID.split('/')[2].split('_').map(capitalizeFirstLetter).join(' ')
}

app.command('/devbook', async ({ ack, context }) => {
  const installationID = context.enterpriseId || context.teamId
  if (!installationID) return

  const installationDBEntry = await getInstallation(supabaseAdmin, installationID)

  if (!installationDBEntry.devbook_app_id) {
    await ack({
      mrkdwn: true,
      text: 'No app powered by Devbook selected',
    })
    return
  }

  const feedback = await listAppFeedback(supabaseAdmin, installationDBEntry.devbook_app_id)

  const data = feedback.reduce<{ [guideID: string]: GuideFeedback }>((prev, curr) => {
    if (!curr.properties.guide) return prev
    let guide = prev[curr.properties.guide]
    if (!guide) {
      guide = { upvotes: 0, downvotes: 0, feedback: [] }
      prev[curr.properties.guide] = guide
    }

    if (curr.feedback) {
      guide.feedback.push({
        rating: curr.properties.rating,
        text: curr.feedback,
        userID: curr.properties.userId || curr.properties.anonymousId,
      })
    } else if (curr.properties.rating === 'up') {
      guide.upvotes += 1
    } else if (curr.properties.rating === 'down') {
      guide.downvotes += 1
    }

    return prev
  }, {})

  const text = Object
    .entries(data)
    .map<[string, GuideFeedback]>(([guideID, guideData]) => {
      guideData.feedback = guideData.feedback.filter(f => f.text.trim().length > 0)
      return [guideID, guideData]
    })
    .filter(([, guideData]) => guideData.downvotes !== 0 || guideData.upvotes !== 0 || guideData.feedback.length > 0)
    .sort(([, g1], [, g2]) => {
      return (g1.downvotes + g1.upvotes + g1.feedback.length) - (g2.downvotes + g2.upvotes + g2.feedback.length)
    })
    .map(([guideID, guideData]) => {
      const upvotes = guideData.upvotes > 0 ? `${guideData.upvotes} :thumbsup:` : ''
      const downvotes = guideData.downvotes > 0 ? `${guideData.downvotes} :thumbsdown:` : ''
      const header = `*${getGuideName(guideID)}* ${upvotes} ${downvotes}`

      const userFeedback = guideData.feedback.map(f => `${f.rating === 'down' ? ':thumbsdown:' : ':thumbsup:'}\n${f.text.trim()}`).join('\n\n')
      return `### ${header + '\n' + userFeedback}`

    }).join('\n\n')

  await ack({
    mrkdwn: true,
    text: '## Prisma Guides Feedback\n\n' + text,
  })
})

appRunner.setup(app)
