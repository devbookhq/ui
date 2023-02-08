import {
  useEffect,
  useState,
} from 'react'
import useSWRMutation from 'swr/mutation'
import dynamic from 'next/dynamic'
import humanId from 'human-id'
import { LayoutGrid } from 'lucide-react'

import { PostProjectBody } from 'pages/api/project'
import { apps } from 'database'
import Text from 'components/typography/Text'
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
  const [repoSetup, setRepoSetup] = useState<Pick<PostProjectBody, 'accessToken' | 'installationID' | 'repositoryID'> & { fullName: string, defaultBranch: string }>()
  const [projectSetup, setProjectSetup] = useState<Pick<PostProjectBody, 'path' | 'branch' | 'id'>>()
  const {
    trigger: createProject,
    data: project,
    error,
  } = useSWRMutation<apps>('/api/project', handlePostProject)

  useEffect(function initProjectSetup() {
    if (!repoSetup) return
    setProjectSetup(s => {
      let id = s?.id
      if (!s) {
        id = humanId({
          separator: '-',
          capitalize: false,
        })
      }

      return {
        id: s?.id || humanId({
          separator: '-',
          capitalize: false,
        }),
        branch: repoSetup.defaultBranch,
        path: s?.path || defaultRepoPath,
      }
    })
  }, [repoSetup])

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
      space-x-4
      lg:flex-row
      items-stretch
      "
      >
        <div className="space-y-2">
          <Text text="Select content repository" className="text-base" />
          <Repositories
            onRepoSelection={setRepoSetup}
          />
        </div>
        <div className="space-y-2">
          <Text text="Setup project" className="text-base" />
          <div className="space-y-2">
            <Text text={`Name ${projectSetup?.id}`} />
            <Text text={`Repository ${repoSetup?.fullName}`} />
            <Text text={`Repository branch ${projectSetup?.branch}`} />
            <Text text={`Repository path ${projectSetup?.path}`} />
            {projectSetup &&
              <Button
                onClick={handleCreateProject}
                text="Create project"
                variant={Button.variant.Full}
              />
            }
          </div>
        </div>
      </div>
    </div>
  )
}
