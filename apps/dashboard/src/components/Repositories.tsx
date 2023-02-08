import { useCallback } from 'react'

import { useGitHub } from 'hooks/useGitHub'
import useListenMessage from 'hooks/useListenMessage'
import { useLocalStorage } from 'hooks/useLocalStorage'
import { useRepositories } from 'hooks/useRepositories'
import { PostProjectBody } from 'pages/api/project'
import { openPopupModal } from 'utils/popupModal'

export interface Props {
  onRepoSelection: (repoSetup: Pick<PostProjectBody, 'accessToken' | 'installationID' | 'repositoryID'> & { fullName: string, defaultBranch: string }) => void
}

function Repositories({ onRepoSelection }: Props) {
  const [accessToken, setAccessToken] = useLocalStorage<string | undefined>('gh_access_token', undefined)
  const gitHub = useGitHub(accessToken)
  const { repos, refetch } = useRepositories(gitHub)

  const handleEvent = useCallback((event: MessageEvent) => {
    if (event.data.accessToken) {
      setAccessToken(event.data.accessToken)
    } else if (event.data.installationID) {
      refetch()
    }
  }, [setAccessToken, refetch])
  useListenMessage(handleEvent)

  function selectRepository(r: Pick<PostProjectBody, 'installationID' | 'repositoryID'> & { fullName: string, defaultBranch: string }) {
    if (!accessToken) return
    onRepoSelection({
      ...r,
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
    <div className="border border-slate-200 rounded p-8 space-y-4 max-w-[450px] flex flex-col">
      {!accessToken
        ? <button
          className="
          py-1
          px-2
          border
          rounded
          shadow
          transition-all
          hover:shadow-lg
          cursor-pointer
        "
          onClick={signWithGitHubOAuth}
        >
          Sign In
        </button>
        : <button
          className="
          py-1
          px-2
          border
          rounded
          shadow
          transition-all
          hover:shadow-lg
          cursor-pointer
        "
          onClick={signWithGitHubOAuth}
        >
          Change Account
        </button>}
      {
        repos && repos.length > 0 && (
          <div className="
            p-4
            max-h-[600px]
            overflow-auto
            w-full
            max-w-[320px]
            flex
            flex-col
            items-start
            justify-start
            space-y-1
            bg-gray-100
            rounded
          ">
            <div className="">
              Import
            </div>
            {repos.map(r => (
              <div
                key={r.id}
                className="
                self-stretch
                transition-all
                p-2
                bg-slate-200
                hover:bg-slate-300
                cursor-pointer
                rounded
              "
                onClick={() => selectRepository({
                  defaultBranch: r.default_branch,
                  installationID: r.installation_id,
                  repositoryID: r.id,
                  fullName: r.full_name,
                })}
              >
                {r.full_name}
              </div>
            ))}
          </div>
        )
      }
      <button className="
            mt-4
            py-1
            px-2
            border
            rounded
            transition-all
            cursor-pointer
            bg-gray-100
          "
        onClick={configureGitHubApp}
      >
        Configure GitHub Permission
      </button>
    </div>
  )
}

export default Repositories
