import { App, LogLevel } from '@slack/bolt'
import { ClearStateStore, InstallationStore } from '@slack/oauth'
import { AppRunner } from '@seratch_/bolt-http-runner'
import {
  deleteInstallation,
  getInstallation,
  setInstallation,
  supabaseAdmin,
} from 'queries/admin'

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

appRunner.setup(app)
