import {
  useCallback,
  useState,
} from 'react'
import useSWRMutation from 'swr/mutation'

import useListenMessage from 'hooks/useListenMessage'
import InstallModal from 'components/GitHubInstallModal'
import { useLocalStorage } from 'hooks/useLocalStorage'
import { useGitHub } from 'hooks/useGitHub'
import { useRepositories } from 'hooks/useRepositories'
import { openPopupModal } from 'utils/popupModal'
import { PostProjectBody } from 'pages/api/project'
import { apps } from 'database'

async function handlePostProject(url: string, { arg }: { arg: PostProjectBody }) {
  return await fetch(url, {
    method: 'POST',
    body: JSON.stringify(arg),
  }).then(r => r.json())
}

export default function Home() {
  const [isInstalling, setIsInstalling] = useState(false)

  const [accessToken, setAccessToken] = useLocalStorage<string | undefined>('gh_access_token', undefined)
  const handleEvent = useCallback((event: MessageEvent) => {
    if (event.data.accessToken) {
      setAccessToken(event.data.accessToken)
    }
  }, [setAccessToken])
  useListenMessage(handleEvent)

  const gitHub = useGitHub(accessToken)
  const repos = useRepositories(gitHub)

  const [projectSetup, setProjectSetup] = useState<PostProjectBody>()
  const {
    trigger: createProject,
    data: project,
    error,
  } = useSWRMutation<apps>('/api/project', handlePostProject)


  function handleCreateProject() {

  }



  async function signWithGitHubOAuth() {
    const url = new URL('/login/oauth/authorize', 'https://github.com')
    url.searchParams.set('client_id', process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!)
    openPopupModal(url)
  }

  function configureGitHubApp() {
    const url = new URL('https://github.com/apps/devbook-for-github/installations/new')
    openPopupModal(url)

    // TODO: Add on close handling so we can refresh the list of repos
  }

  return (
    <div className='h-full flex flex-col items-center justify-center'>
      {isInstalling && (
        <InstallModal
          onOutsideModalClick={() => setIsInstalling(false)}
        />
      )}

      {!repos &&
        <button
          className='
              py-1
              px-2
              border
              rounded
              shadow
              transition-all
              hover:shadow-lg
              cursor-pointer
            '
          onClick={signWithGitHubOAuth}
        >
          Connect Repository
        </button>
      }
      {repos && repos.length > 0 && (
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
              key={r.clone_url}
              className="
                self-stretch
                transition-all
                p-2
                bg-slate-200
                hover:bg-slate-300
                cursor-pointer
                rounded
              "
              onClick={() => { }}
            >
              {r.full_name}
            </div>
          ))}
        </div>
      )}
      {accessToken && (
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
      )}
    </div>
  )
}
