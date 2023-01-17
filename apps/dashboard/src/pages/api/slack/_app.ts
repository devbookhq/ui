import { App, LogLevel } from '@slack/bolt'
import { FileStateStore, InstallationStore } from '@slack/oauth'
import { AppRunner } from '@seratch_/bolt-http-runner'
import { deleteInstallation, getInstallation, setInstallation, supabaseAdmin } from 'queries/supabaseAdmin'

const installationStore: InstallationStore = {
  storeInstallation: async (installation) => {
    installation.incomingWebhook
    // Bolt will pass your handler an installation object
    // Change the lines below so they save to your database
    if (installation.isEnterpriseInstall && installation.enterprise !== undefined) {
      // handle storing org-wide app installation
      return await setInstallation(supabaseAdmin, installation.enterprise.id, installation)
    }
    if (installation.team !== undefined) {
      // single team app installation
      return await setInstallation(supabaseAdmin, installation.team.id, installation)
    }
    throw new Error('Failed saving installation data to installationStore')
  },
  fetchInstallation: async (installQuery) => {
    // Bolt will pass your handler an installQuery object
    // Change the lines below so they fetch from your database
    if (installQuery.isEnterpriseInstall && installQuery.enterpriseId !== undefined) {
      // handle org wide app installation lookup
      return await getInstallation(supabaseAdmin, installQuery.enterpriseId)
    }
    if (installQuery.teamId !== undefined) {
      // single team app installation lookup
      return await getInstallation(supabaseAdmin, installQuery.teamId)
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
  logLevel: LogLevel.DEBUG,
  signingSecret: process.env.SLACK_SIGNING_SECRET || '',
  clientId: process.env.SLACK_CLIENT_ID || '',
  clientSecret: process.env.SLACK_CLIENT_SECRET || '',
  scopes: ['incoming-webhook', 'commands'],
  // scopes: ['commands', 'chat:write', 'app_mentions:read'],
  // installationStore: new FileInstallationStore(),
  installationStore,
  installerOptions: {
    stateStore: new FileStateStore({}),
  },
})

const app = new App(appRunner.appOptions())

app.command('/devbook', async ({ command, ack }) => {
  await ack({
    mrkdwn: true,
    text: '`this is rich`',
  })
})

appRunner.setup(app)