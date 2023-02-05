import type { HandlerFunction } from '@octokit/webhooks/dist-types/types'
import {
  Webhooks,
  createNodeMiddleware,
} from '@octokit/webhooks'

import { getAppContentFromRepo, getRepo } from './repo'
import { prisma } from 'queries/prisma'
import getClient from './octokit'
import { apps_content } from '@prisma/client'

export const branchRefPrefix = 'refs/heads/'

export async function getGitHubWebhooksMiddleware() {
  const webhooks = new Webhooks({
    secret: process.env.GITHUB_APP_WEBHOOK_SECRET!,
  })
  webhooks.on('push', pushHandler)
  return createNodeMiddleware(webhooks, { path: '/api/github/webhook' })
}

// TODO: We may need to manually trigger this handler when the user connects the repo for the first time
const pushHandler: HandlerFunction<'push', unknown> = async (event) => {
  const { payload } = event
  const [repositoryOwnerName, repositoryName] = payload.repository.full_name.split('/')
  const installationID = payload.installation?.id
  const repositoryID = payload.repository.id
  const repositoryBranch = payload.ref.slice(branchRefPrefix.length)

  if (!installationID) {
    throw new Error('InstallationID not found')
  }

  const connectedApps = await prisma.apps.findMany({
    where: {
      repository_branch: {
        equals: repositoryBranch,
      },
      github_installations: {
        repository_id: repositoryID,
      },
    },
  })

  if (connectedApps.length === 0) return

  const github = await getClient({ installationID })
  const repo = await getRepo({
    github,
    repo: repositoryName,
    owner: repositoryOwnerName,
    ref: payload.ref,
  })

  await Promise.all(connectedApps.map(async app => {
    try {
      const content = await getAppContentFromRepo({
        dir: app.repository_path,
        repo,
      })

      if (!content) throw new Error('No content found in the repo')

      await prisma.apps_content.upsert({
        create: {
          content: content as unknown as NonNullable<apps_content['content']>,
          app_id: app.id,
        },
        update: {
          content: content as unknown as NonNullable<apps_content['content']>,
        },
        where: {
          app_id: app.id,
        }
      })
    } catch (err) {
      console.error(`Error processing git push to app "${app.id}" content from repository "${payload.repository.full_name}"`, err)
    }
  }))
}
