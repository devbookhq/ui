import { useCallback, useState } from 'react'
import { GithubIcon } from 'lucide-react'

import { useGitHub } from 'hooks/useGitHub'
import useListenMessage from 'hooks/useListenMessage'
import Button from 'components/Button'
import Text from 'components/typography/Text'
import { useLocalStorage } from 'hooks/useLocalStorage'
import { useRepositories } from 'hooks/useRepositories'
import { PostProjectBody } from 'pages/api/project'
import { openPopupModal } from 'utils/popupModal'
import TitleButton from './TitleButton'
import clsx from 'clsx'

export interface Props {
  onRepoSelection: (repoSetup: Pick<PostProjectBody, 'accessToken' | 'installationID' | 'repositoryID'> & { fullName: string, defaultBranch: string, branches?: string[] }) => void
}

function Repositories({ onRepoSelection }: Props) {
  const [accessToken, setAccessToken] = useLocalStorage<string | undefined>('gh_access_token', undefined)
  const gitHub = useGitHub(accessToken)
  const { repos, refetch } = useRepositories(gitHub)
  const [selectedRepo, setSelectedRepo] = useState<number>()

  const handleEvent = useCallback((event: MessageEvent) => {
    if (event.data.accessToken) {
      setAccessToken(event.data.accessToken)
    } else if (event.data.installationID) {
      refetch()
    }
  }, [setAccessToken, refetch])
  useListenMessage(handleEvent)

  async function selectRepository(r: Pick<PostProjectBody, 'installationID' | 'repositoryID'> & { fullName: string, defaultBranch: string }) {
    if (!accessToken) return
    onRepoSelection({
      ...r,
      accessToken,
    })

    setSelectedRepo(r.repositoryID)

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
    const w = openPopupModal(url)

    if (w) {
      w.onclose = (e) => {
        refetch()
      }
    }
  }

  return (
    <div className="flex flex-1 max-w-[450px] flex-col space-y-2">
      <div className="border border-slate-200 rounded p-8 space-y-4 flex flex-col items-center">
        {!accessToken &&
          <div>
            <Button
              variant={Button.variant.Full}
              onClick={signWithGitHubOAuth}
              text="Connect GitHub"
              icon={<GithubIcon />}
            />
          </div>
        }
        {accessToken && repos && repos.length === 0 &&
          <div>
            <Text text="No connected repositories found" />
            <Button
              variant={Button.variant.Full}
              onClick={configureGitHubApp}
              text="Configure permissions"
              icon={<GithubIcon />}
            />
          </div>
        }

        {accessToken && repos && repos.length > 0 &&
          <div className="
            max-h-[600px]
            overflow-auto
            w-full
            max-w-[320px]
            flex
            flex-col
            justify-start
            space-y-1
            items-stretch
          ">
            {repos.map(r => (
              <Button
                className={clsx({ 'border-slate-500 font-semibold': r.id === selectedRepo })}
                key={r.id}
                onClick={() => selectRepository({
                  defaultBranch: r.default_branch,
                  installationID: r.installation_id,
                  repositoryID: r.id,
                  fullName: r.full_name,
                })}
                text={r.full_name}
              />
            ))}
          </div>
        }
      </div>
      {accessToken &&
        <div className="flex space-x-2 justify-between">
          <TitleButton
            onClick={signWithGitHubOAuth}
            text="Change Account"
          />
          <TitleButton
            onClick={configureGitHubApp}
            text="Configure Permissions"
          />
        </div>
      }
    </div>
  )
}

export default Repositories
