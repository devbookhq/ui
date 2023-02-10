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
  ExternalLink,
} from 'lucide-react'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import Link from 'next/link'

import { PostProjectBody } from 'pages/api/project'
import { apps } from 'database'
import Text from 'components/typography/Text'
import Input from 'components/Input'
import Select from 'components/Select'
import { defaultRepoPath } from 'utils/constants'
import Button from 'components/Button'
import TitleButton from 'components/TitleButton'
import SpinnerIcon from 'components/icons/Spinner'

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
  const [isCreating, setIsCreating] = useState(false)
  const [repoSetup, setRepoSetup] = useState<Pick<PostProjectBody, 'accessToken' | 'installationID' | 'repositoryID'> & { fullName: string, defaultBranch: string, branches?: string[], url: string }>()
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

  async function handleCreateProject() {
    if (!repoSetup || !projectSetup) return

    setIsCreating(true)
    try {
      await createProject({
        ...projectSetup,
        ...repoSetup,
      })
    } finally {
      setIsCreating(false)
    }
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
                className="space-y-6 rounded border p-8 flex flex-col bg-white"
              >
                <div className="flex flex-col space-y-6">
                  <div className="flex space-x-2 items-start">
                    <Input
                      label="Project name"
                      placeholder="Project name"
                      value={projectSetup?.id}
                      onChange={v => setProjectSetup(p => p ? ({ ...p, id: v }) : undefined)}
                      autofocus
                    />
                  </div>

                  <div className="flex space-x-2 items-start">
                    <GithubIcon size="16px" />
                    <div className="flex flex-col space-y-1">
                      <Text text="Repository" size={Text.size.S3} />
                      <Link
                        href={{
                          pathname: repoSetup.url,
                        }}
                        className="flex space-x-1 hover:text-blue-600"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Text
                          text={`${repoSetup?.fullName}`}
                          className="font-semibold underline"
                        />
                        <ExternalLink size="12px" />
                      </Link>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <GitBranch size="16px" />
                    <div className="flex flex-col space-y-1">
                      <Text text="Branch" size={Text.size.S3} />
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
                        isTransparent
                      />
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Folder size="16px" />
                    <Input
                      label="Root directory"
                      placeholder="Root directory"
                      value={projectSetup?.path}
                      onChange={v => setProjectSetup(p => p ? ({ ...p, path: v }) : undefined)}
                      isTransparent
                    />
                  </div>
                </div>
                <div className="flex justify-center">
                  <Button
                    isDisabled={!projectSetup || !repoSetup || !projectSetup.id || !projectSetup.branch || !projectSetup.path || isCreating}
                    onClick={handleCreateProject}
                    text="Create project"
                    variant={Button.variant.Full}
                    className="self-center whitespace-nowrap"
                    icon={isCreating ? <SpinnerIcon className="text-white" /> : null}
                  />
                  {!isCreating && error && (
                    <Text
                      className="self-center text-red-500"
                      size={Text.size.S3}
                      text={error}
                    />
                  )}
                </div>
              </div>
              <TitleButton
                onClick={() => setRepoSetup(undefined)}
                text="Change repository"
              />
            </div>
          }
        </div>
      </div>
    </div>
  )
}
