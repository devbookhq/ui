// import {
//   DependencyList,
//   useEffect,
//   useMemo,
//   useState,
// } from 'react'
// import { useQuery } from '@apollo/client'

// import {
//   GetInstallationRepositories,
//   GetInstallationRepositoriesVariables,
//   GetTeamRepositoriesVariables,
//   GetTeamRepositories,
//   GetInstallationRepositories_installationRepositories,
// } from 'src/apollo/__generated/types'
// import { useGitHub } from 'src/repository/gitHubContext'
// import { queries as repositoryQueries } from 'src/repository'
// import { queries as teamQueries } from 'src/team'
// import { replaceRepositories, ReplaceRepository } from 'src/repository/updateRepositories'
// import client from 'src/apollo/client'

function useInstallationRepositories(teamID: string | undefined, deps: DependencyList = []) {
  const gitHub = useGitHub()

  const [userInstallationIDs, setUserInstallationIDs] = useState<number[]>()

  useEffect(function getInstallations() {
    async function fetch() {
      if (!gitHub) return
      if (!teamID) return

      const installationsResult = await gitHub.apps.listInstallationsForAuthenticatedUser({
        accept: 'application/vnd.github.v3+json',
        per_page: 100,
        headers: {
          // We have to manually circumvent the caching mechanism here, because we make this request as server-to-server (which is not cached).
          // This request is called only when the user changes or when the component mounts, so we don't exceed the GitHub API quotas.
          'If-Modified-Since': 'Sun, 14 Nov 2021 13:42:15 GMT',
        },
      })

      const { installations } = installationsResult.data
      setUserInstallationIDs(installations.map(i => i.id))
    }
    fetch()
  }, [gitHub, teamID])

  const { data: installationRepositoriesData } = useQuery<GetInstallationRepositories, GetInstallationRepositoriesVariables>(repositoryQueries.GET_INSTALLATION_REPOSITORIES, {
    variables: {
      teamID: teamID!,
      userInstallationIDs: userInstallationIDs!,
    },
    skip: !userInstallationIDs || !teamID,
    fetchPolicy: 'cache-and-network',
  })

  useEffect(function updateCache() {
    async function update() {

      if (!teamID) return
      if (!installationRepositoriesData?.installationRepositories) return

      const teamRepositoriesResult = await client.query<GetTeamRepositories, GetTeamRepositoriesVariables>({
        query: teamQueries.GET_TEAM_REPOSITORIES,
        variables: {
          teamID,
        },
        fetchPolicy: 'cache-only',
      })

      const reposToUpdate: ReplaceRepository[] = installationRepositoriesData?.installationRepositories.map(repository => ({
        ...repository,
        teamID,
        __typename: 'Repository',
      })) || []

      const reposToClean: ReplaceRepository[] = teamRepositoriesResult.data.team?.repositories.map(repository => ({
        ...repository,
        owner: null,
        repo: null,
        defaultBranch: null,
      })) || []

      replaceRepositories({
        repositories: reposToClean,
        teamID,
      })

      replaceRepositories({
        repositories: reposToUpdate,
        teamID,
      })
    }
    update()
  }, [
    installationRepositoriesData?.installationRepositories,
    teamID,
    ...deps,
  ])

  const repositories = useMemo(() => installationRepositoriesData
    ?.installationRepositories
    ?.slice()
    .sort((a, b) => a.repo.localeCompare(b.repo))
    .sort((a, b) => a.owner.localeCompare(b.owner)) as GetInstallationRepositories_installationRepositories[]
    , [installationRepositoriesData?.installationRepositories])

  return teamID ? repositories : undefined
}

export default useInstallationRepositories