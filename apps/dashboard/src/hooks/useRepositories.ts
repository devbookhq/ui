import { useEffect, useState } from 'react'

import { GitHubUserClient } from 'github/userClient'

async function fetchRepos(client: GitHubUserClient) {
  const installations = await client.apps.listInstallationsForAuthenticatedUser()
  const repos = await Promise.all(
    installations.data.installations.map(async i => client.apps.listInstallationReposForAuthenticatedUser({
      installation_id: i.id,
    })))
  return repos.flatMap(r => r.data.repositories)
}

export function useRepositories(client?: GitHubUserClient) {
  const [repos, setRepos] = useState<Awaited<ReturnType<typeof fetchRepos>>>()

  useEffect(function fetch() {
    if (!client) return
    fetchRepos(client).then(setRepos)
  }, [client])

  return repos
}
