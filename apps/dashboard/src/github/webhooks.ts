import type { HandlerFunction } from '@octokit/webhooks/dist-types/types'
import {
  Webhooks,
  createNodeMiddleware,
} from '@octokit/webhooks'

import { getGuidesFromRepo } from './repo'
import { supabaseAdmin, upsertGuideEntry } from 'queries/admin'
import { GuideContentDBENtry } from 'queries/db'
import { Json } from 'queries/supabase'

export const defaultDevbookDir = 'devbook'
export const branchRefprefix = 'refs/heads/'
export const fileDotSlashPattern = /(?:\.\/|\.)?(.*)/

export async function getGitHubWebhooksMiddleware() {
  const webhooks = new Webhooks({
    secret: process.env.GITHUB_APP_WEBHOOK_SECRET!,
  })
  webhooks.on('push', pushHandler)
  return createNodeMiddleware(webhooks, { path: '/api/github/webhook' })
}

const pushHandler: HandlerFunction<'push', unknown> = async (event) => {
  const { payload } = event
  const [repositoryOwnerName, repositoryName] = payload.repository.full_name.split('/')
  const installationID = payload.installation?.id
  // const repositoryGitHubID = payload.repository.id.toString()
  const repositoryBranch = payload.ref.slice(branchRefprefix.length)

  if (!installationID) {
    throw new Error('InstallationID not found')
  }

  // TODO: We may need to manually trigger this handler when the user connects the repo for the first time
  // TODO: Get project_id associated with this repository installation
  // TODO: Filter by a specific branch

  const guides = await getGuidesFromRepo({
    installationID,
    repo: repositoryName,
    dir: defaultDevbookDir,
    owner: repositoryOwnerName,
    ref: payload.ref,
  })

  await upsertGuideEntry(guides.map(g => ({
    project_id: 'test',
    repository_fullname: payload.repository.full_name,
    slug: g.slug,
    branch: repositoryBranch,
    content: {
      env: g.envConfig,
      guide: g.guideConfig,
      steps: [
        g.introFile,
        ...g.stepFiles,
        g.ratingFile,
      ]
    } as GuideContentDBENtry as unknown as Json,
  })), supabaseAdmin)

  // TODO: Trigger static revalidation for the nextjs pages (maybe use supabase db triggers for this)
}
