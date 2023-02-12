import { Select } from '@radix-ui/react-select'
import { GithubIcon, ExternalLink, GitBranch, Folder } from 'lucide-react'
import Link from 'next/link'

import Input from 'components/Input'
import Text from 'components/typography/Text'
import { apps } from 'database'

export interface Props {
  app: apps & {
    github_repositories: {
      repository_fullname: string;
    } | null
  }
}

function AppInfo({ app }: Props) {
  return (
    <>
      {app.repository_id &&
        <div className="flex flex-col space-y-1 text-slate-500 pr-4 self-center">
          <div className="flex items-center space-x-2">
            <GithubIcon size="14px" />
            <Link
              href={{
                pathname: `https://github.com/${app.github_repositories?.repository_fullname}`,
              }}
              className="flex space-x-1 hover:text-blue-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Text
                text={`${app.github_repositories?.repository_fullname}`}
                className="font-semibold underline"
                size={Text.size.S3}
              />
              <ExternalLink size="10px" />
            </Link>
          </div>

          <div className="flex items-center space-x-2">
            <GitBranch size="14px" />
            <Text
              text={`${app.repository_branch}`}
              size={Text.size.S3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Folder size="14px" />
            <Text
              text={`${app.repository_path}`}
              size={Text.size.S3}
            />
          </div>
        </div>
      }
    </>
  )
}

export default AppInfo
