import { Octokit } from '@octokit/rest'

async function getUserClient({ accessToken }: { accessToken: string }) {
  return new Octokit({
    auth: accessToken,
  })
}


export type GitHubUserClient = Awaited<ReturnType<typeof getUserClient>>

export default getUserClient
