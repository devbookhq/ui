import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import getUserClient from 'github/userClient'
import { nanoid } from 'nanoid'
import { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from 'queries/prisma'

export interface PostProjectBody {
  repositoryID: number
  installationID: number
  accessToken: string
  branch: string
  path: string
  title: string
  subdomain: string
}

async function postProject(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body as PostProjectBody
  try {
    const supabase = createServerSupabaseClient({ req, res })
    // Check if we have a session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session)
      return res.status(401).json({
        error: 'not_authenticated',
        description: 'The user does not have an active session or is not authenticated',
      })

    const gh = getUserClient({ accessToken: body.accessToken })
    const repos = await gh.apps.listInstallationReposForAuthenticatedUser({
      installation_id: body.installationID,
      // TODO: Add pagination so we fetch all the repos not just the first 100
      per_page: 100,
      headers: {
        // We have to manually circumvent the caching mechanism here.
        // This request is called only when the user changes or when the component mounts, so we don't exceed the GitHub API quotas.
        'If-Modified-Since': 'Sun, 14 Nov 2021 13:42:15 GMT',
      },
    })

    const repo = repos.data.repositories.find(r => r.id === body.repositoryID)

    if (!repo)
      return res.status(401).json({
        error: 'invalid_repo',
      })

    const user = await prisma.auth_users.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        users_teams: {
          include: {
            teams: true,
          }
        }
      },
    })
    if (!user)
      return res.status(401).json({
        error: 'invalid_user',
      })

    const defaultTeam = user.users_teams.find(t => t.teams.is_default)
    if (!defaultTeam)
      return res.status(401).json({
        error: 'invalid_default_team',
      })

    const newApp = await prisma.apps.create({
      data: {
        id: nanoid(),
        teams: {
          connect: {
            id: defaultTeam.teams.id,
          },
        },
        repository_branch: body.branch,
        repository_path: body.path,
        subdomain: body.subdomain,
        title: body.title,
        github_repositories: {
          connectOrCreate: {
            where: {
              repository_id: repo.id,
            },
            create: {
              installation_id: body.installationID,
              repository_fullname: repo.full_name,
              repository_id: repo.id,
            },
          }
        },
      },
    })

    res.status(200).json(newApp)
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
  await postProject(req, res)
}

export default handler
