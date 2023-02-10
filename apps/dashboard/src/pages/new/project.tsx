import {
  useEffect,
  useState,
} from 'react'
import useSWRMutation from 'swr/mutation'
import dynamic from 'next/dynamic'
import humanId from 'human-id'
import {
  GitBranch,
  LayoutGrid,
  Folder,
  GithubIcon,
  X,
} from 'lucide-react'
import { useRouter } from 'next/router'
import clsx from 'clsx'

import { PostProjectBody } from 'pages/api/project'
import { apps } from 'database'
import Text from 'components/typography/Text'
import Input from 'components/Input'
import Select from 'components/Select'
import { defaultRepoPath } from 'utils/constants'
import Button from 'components/Button'

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
    lg:p-12
  "
    >
      <div className="flex items-start space-x-4">
        <div className="items-center flex space-x-2">
          <LayoutGrid size="30px" strokeWidth="1.5" />
          <Text
            size={Text.size.S1}
            text="Create New Project"
          />
        </div>
      </div>
      <div className="flex flex-1 justify-center">
        <div className="w-[450px] flex max-h-[600px]">
          <div
            className={clsx(
              'flex flex-col flex-1 space-y-2',
              { 'hidden': repoSetup },
            )}
          >
            <Text
              text="Select repository"
              className="text-base"
            />
            <Repositories
              onRepoSelection={setRepoSetup}
            />
          </div>
          {repoSetup &&
            <div className="space-y-2 flex-1 flex flex-col">
              <Text
                text="Configure project"
                className="text-base"
              />
              <div
                className="space-y-8 rounded border p-8 flex flex-col bg-white"
              >
                <div className="flex flex-col space-y-8">
                  <div className="flex space-x-2 items-start">
                    <Input
                      label="Project name"
                      autofocus
                      placeholder="Project name"
                      value={projectSetup?.id}
                      onChange={v => setProjectSetup(p => p ? ({ ...p, id: v }) : undefined)}
                    />
                  </div>

                  <div className="flex space-x-2 items-start">
                    <GithubIcon size="16px" />
                    <div className="flex flex-col space-y-1">
                      <Text text="Repository" size={Text.size.S3} />
                      <div className="flex items-center space-x-1">
                        <Text
                          text={`${repoSetup?.fullName}`}
                          className="font-semibold"
                        />
                        <X
                          className="text-slate-300 hover:text-slate-500 cursor-pointer"
                          size="16px"
                          onClick={() => setRepoSetup(undefined)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <GitBranch size="16px" />
                    <div className="flex flex-col space-y-1">
                      <Text text="Branch" size={Text.size.S3} />
                      <Select
                        isTransparent
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
                  </div>

                  <div className="flex items-start space-x-2">
                    <Folder size="16px" />
                    <Input
                      label="Root directory"
                      isTransparent
                      placeholder="Root directory"
                      value={projectSetup?.path}
                      onChange={v => setProjectSetup(p => p ? ({ ...p, path: v }) : undefined)}
                    />
                  </div>
                </div>
                <div className="flex justify-center">
                  <Button
                    isDisabled={!projectSetup || !repoSetup || !projectSetup.id || !projectSetup.branch || !projectSetup.path}
                    onClick={handleCreateProject}
                    text="Create project"
                    variant={Button.variant.Full}
                  />
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  )
}
