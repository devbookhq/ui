import React, { useCallback, useMemo, useState } from 'react'
import { GithubIcon, SearchIcon } from 'lucide-react'
import clsx from 'clsx'
import Fuse from 'fuse.js'

import { useGitHub } from 'hooks/useGitHub'
import useListenMessage from 'hooks/useListenMessage'
import Button from 'components/Button'
import Text from 'components/typography/Text'
import { useLocalStorage } from 'hooks/useLocalStorage'
import { useRepositories } from 'hooks/useRepositories'
import { PostProjectBody } from 'pages/api/project'
import { openPopupModal } from 'utils/popupModal'
import TitleButton from 'components/TitleButton'
import Input from 'components/Input'
import SpinnerIcon from 'components/icons/Spinner'

export interface Props {
  onRepoSelection: (repoSetup: Pick<PostProjectBody, 'accessToken' | 'installationID' | 'repositoryID'> & { fullName: string, defaultBranch: string, branches?: string[], url: string }) => void
}

function Repos({ onRepoSelection }: Props) {
  const [accessToken, setAccessToken] = useLocalStorage<string | undefined>('gh_access_token', undefined)
  const gitHub = useGitHub(accessToken)
  const { repos, refetch } = useRepositories(gitHub)
  const [query, setQuery] = useState<string>()

  const searchEngine = useMemo(() => {
    if (!repos) return
    return new Fuse(repos, {
      keys: ['full_name'],
      threshold: 0.4,
    })
  }, [repos])

  const filteredRepos = query && searchEngine ? searchEngine.search(query).map(i => i.item) : repos || []

  const handleEvent = useCallback((event: MessageEvent) => {
    if (event.data.accessToken) {
      setAccessToken(event.data.accessToken)
    } else if (event.data.installationID) {
      refetch()
    }
  }, [setAccessToken, refetch])
  useListenMessage(handleEvent)

  async function selectRepository(r: Pick<PostProjectBody, 'installationID' | 'repositoryID'> & { fullName: string, defaultBranch: string, url: string }) {
    if (!accessToken) return
    onRepoSelection({
      ...r,
      accessToken,
      branches: [r.defaultBranch],
    })

    const [repositoryOwnerName, repositoryName] = r.fullName.split('/')
    const repoBranches = await gitHub?.repos.listBranches({
      owner: repositoryOwnerName,
      repo: repositoryName,
    })

    const branches = repoBranches?.data.map(b => b.name)
    onRepoSelection({
      ...r,
      branches,
      accessToken,
    })
  }

  async function signWithGitHubOAuth() {
    const url = new URL('/login/oauth/authorize', 'https://github.com')
    url.searchParams.set('client_id', process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!)
    openPopupModal(url)
  }

  function configureGitHubApp() {
    const url = new URL('https://github.com/apps/devbook-for-github/installations/new')
    openPopupModal(url)
  }

  return (
    <div className="flex flex-1 flex-col space-y-2 overflow-hidden">
      <div className={clsx(`
        border
        overflow-hidden
        rounded
        flex
        flex-col
        flex-1`,
        { 'bg-white': accessToken },
      )}>
        {!accessToken &&
          <div className="flex flex-1 justify-center items-center">
            <Button
              variant={Button.variant.Full}
              onClick={signWithGitHubOAuth}
              text="Connect GitHub"
              icon={<GithubIcon />}
            />
          </div>
        }

        {accessToken &&
          <div className="flex overflow-hidden flex-col flex-1">
            <div className="flex items-center space-x-2 border-b px-8 py-4">
              <SearchIcon size="16px" />
              <Input
                placeholder="Search repositories..."
                value={query}
                onChange={q => setQuery(q)}
                autofocus
              />
            </div>


            {!repos &&
              <div className="flex flex-1 items-center justify-center flex-col space-y-1 text-slate-500">
                <SpinnerIcon className="text-slate-400" />
                <Text text="Fetching repositories" />
              </div>
            }

            {repos && repos.length === 0 &&
              <div className="flex flex-1 items-center justify-center">
                <Text text="No connected repositories found" />
                <Button
                  variant={Button.variant.Full}
                  onClick={configureGitHubApp}
                  text="Configure permissions"
                  icon={<GithubIcon />}
                />
              </div>
            }

            {repos && repos.length > 0 &&
              <div className="
            flex
            flex-col
            scroller
            overflow-auto
            pl-8
            flex-1
            pr-6
          ">
                {filteredRepos.map(r => (
                  <div
                    className={clsx(
                      'flex',
                      'justify-between',
                      'py-4',
                      'border-b',
                    )}
                    key={r.id}
                  >
                    <div className="flex items-center space-x-2">
                      <GithubIcon size="16px" />
                      <Text text={r.full_name} className="" />
                    </div>
                    <Button
                      onClick={() => selectRepository({
                        defaultBranch: r.default_branch,
                        installationID: r.installation_id,
                        repositoryID: r.id,
                        fullName: r.full_name,
                        url: r.html_url,
                      })}
                      text="Select"
                    />
                  </div>
                ))}
              </div>
            }
          </div>
        }
      </div>
      {accessToken &&
        <div className="flex justify-between">
          <TitleButton
            onClick={signWithGitHubOAuth}
            text="Reauthenticate GitHub Account"
          />
          <TitleButton
            onClick={configureGitHubApp}
            text="Configure GitHub App"
          />
        </div>
      }
    </div>
  )
}

export default Repos
