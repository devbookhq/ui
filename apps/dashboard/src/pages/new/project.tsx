import {
  useState,
} from 'react'

import useListenMessage from 'hooks/useListenMessage'
import InstallModal from 'components/GitHubInstallModal'

async function githubAPI(method: string, endpoint: string, accessToken: string) {
  const url = new URL(endpoint, 'https://api.github.com')
  const r = await fetch(url, {
    method,
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${accessToken}`,
    },
  })
  return r.json()
}

export default function Home() {
  const [isInstalling, setIsInstalling] = useState(false)
  const [accessToken, setAcessToken] = useState('')
  const [repos, setRepos] = useState<any[]>([])

  useListenMessage(async (event) => {
    const { accessToken: at, setupAction } = event.data
    if (at) {
      setAcessToken(at)
      fetchRepos(at)
    }
    if (setupAction) {
      if (!accessToken) throw new Error('Cannot fetch repos - no access token')
      fetchRepos(accessToken)
    }
  }, [accessToken])

  function openModal(url: URL) {
    const features = {
      popup: 'yes',
      width: 600,
      height: 700,
      top: 'auto',
      left: 'auto',
      toolbar: 'no',
      menubar: 'no',
    }
    const strWindowsFeatures = Object.entries(features)
      .reduce((str, [key, value]) => {
        if (value == 'auto') {
          if (key === 'top') {
            const v = Math.round(
              window.innerHeight / 2 - features.height / 2
            )
            str += `top=${v},`
          } else if (key === 'left') {
            const v = Math.round(
              window.innerWidth / 2 - features.width / 2
            )
            str += `left=${v},`
          }
          return str
        }

        str += `${key}=${value},`
        return str
      }, '')
      .slice(0, -1) // remove last ',' (comma)
    window.open(url, '_blank', strWindowsFeatures)
  }

  async function fetchRepos(at: string) {
    setRepos([])
    const { installations } = await githubAPI('GET', '/user/installations', at)
    const promises = installations.map(async (inst: any) => {
      return githubAPI('GET', `user/installations/${inst.id}/repositories`, at)
    })
    const repos = await Promise.all(promises)
    const flattened = repos.flatMap(r => r.repositories)
    console.log(flattened)
    setRepos(flattened)
  }

  async function installTailwind(e: any) {
    // setIsInstalling(true)
    const url = new URL('/login/oauth/authorize', 'https://github.com')
    url.searchParams.set('client_id', process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!)
    openModal(url)
  }

  function configureApp() {
    const url = new URL('https://github.com/apps/devbook-for-github/installations/new')
    openModal(url)
  }

  function selectRepo(repo: any) {
    if (!accessToken) throw new Error('Cannot select repo - no access token')

    const {
      default_branch,
      url,
      clone_url,
    } = repo
    console.log(repo)
    console.log({ default_branch, url })

    // TODO: Send access token and repo info to session
  }
  function onModalClick(e: any) {
    e.stopPropagation()
  }

  return (
    <div className='h-full flex flex-col items-center justify-center'>
      {isInstalling && (
        <InstallModal
          onOutsideModalClick={() => setIsInstalling(false)}
        />
      )}

      {repos.length === 0 &&
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
          onClick={installTailwind}
        >
          Install Tailwind
        </button>
      }


      {repos.length > 0 && (
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
            Where to install Tailwind?
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
              onClick={() => selectRepo(r)}
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
          onClick={configureApp}
        >
          Configure GitHub Permission
        </button>
      )}
    </div>
  )
}
