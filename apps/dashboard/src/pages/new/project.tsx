import {
  useEffect,
  useState,
} from 'react'
import useSWRMutation from 'swr/mutation'
import dynamic from 'next/dynamic'
import humanId from 'human-id'
import { GitBranch, LayoutGrid, Folder, GithubIcon } from 'lucide-react'

import { PostProjectBody } from 'pages/api/project'
import { apps } from 'database'
import Text from 'components/typography/Text'
import Input from 'components/Input'
import Select from 'components/Select'
import { defaultRepoPath } from 'utils/constants'
import Button from 'components/Button'
import { useRouter } from 'next/router'

const Repositories = dynamic(() => import('components/Repositories'), { ssr: false })

async function handlePostProject(url: string, { arg }: { arg: PostProjectBody }) {
  return await fetch(url, {
    method: 'POST',
    body: JSON.stringify(arg),

    headers: {
      'Content-Type': 'application/json',
    },
  }).then(r => r.json())
}

export default function NewProject() {
  const [repoSetup, setRepoSetup] = useState<Pick<PostProjectBody, 'accessToken' | 'installationID' | 'repositoryID'> & { fullName: string, defaultBranch: string, branches?: string[] }>()
  const [projectSetup, setProjectSetup] = useState<Pick<PostProjectBody, 'path' | 'branch' | 'id'>>()
  const {
    trigger: createProject,
    data: project,
    error,
  } = useSWRMutation<Pick<apps, 'id' | 'repository_path'>>('/api/project', handlePostProject)

  const router = useRouter()

  useEffect(function initProjectSetup() {
    if (!repoSetup) return
    setProjectSetup(s => ({
      id: s?.id || humanId({
        separator: '-',
        capitalize: false,
      }),
      branch: repoSetup.defaultBranch,
      path: s?.path || defaultRepoPath,
    }))
  }, [repoSetup])

  useEffect(function redirect() {
    if (!project) return
    router.push({
      pathname: '/projects/[id]',
      query: {
        id: project.id,
      },
    })
  }, [project, router])

  function handleCreateProject() {
    if (!repoSetup || !projectSetup) return

    createProject({
      ...projectSetup,
      ...repoSetup,
    })
  }

  return (
    <div
      className="
    flex
    flex-1
    flex-col
    space-x-0
    space-y-8
    overflow-hidden
    p-8
    lg:flex-row
    lg:space-y-0
    lg:space-x-8
    lg:p-12
  "
    >
      <div className="flex items-start space-x-4 lg:justify-start justify-between">
        <div className="items-center flex space-x-2">
          <LayoutGrid size="30px" strokeWidth="1.5" />
          <Text
            size={Text.size.S1}
            text="New Project"
          />
        </div>
      </div>

      <div
        className="
          flex
          flex-1
          flex-col
          space-x-2
          lg:flex-row
          justify-center
          "
      >
        <div
          className="space-y-2 flex flex-col flex-1"
        >
          <div className="flex">
            <Text
              text="1. Select content repository"
              className="text-base"
            />
          </div>
          <Repositories
            onRepoSelection={setRepoSetup}
          />
        </div>
        <div className="space-y-2 flex-1 flex items-stretch flex-col">
          <Text
            text="2. Configure project"
            className="text-base"
          />
          {projectSetup &&
            <div
              className="space-y-6 rounded border p-8"
            >
              <Input
                value={projectSetup?.id || ''}
                onChange={v => setProjectSetup(p => p ? ({ ...p, id: v }) : undefined)}
              />
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <GithubIcon size="16px" />
                  <Text
                    text={`${repoSetup?.fullName}`}
                    className="font-semibold"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <GitBranch size="16px" />
                  <Select
                    items={(repoSetup?.branches || []).map(r => ({
                      label: r,
                      value: r,
                    })).sort((a, b) => {
                      return a.label.localeCompare(b.label)
                    })}
                    onSelect={(i) => {
                      setProjectSetup(s => s ? ({ ...s, branch: i?.value || s.branch }) : undefined)
                    }}
                    selectedItemLabel={projectSetup?.branch}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Folder size="16px" />
                  <Text text={`${projectSetup?.path}`} />
                </div>
              </div>
              <div className="flex flex-1">
                <Button
                  onClick={handleCreateProject}
                  text="Create project"
                  variant={Button.variant.Full}
                />
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  )
}
