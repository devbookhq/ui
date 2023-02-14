import { useSession, SharedSessionProvider } from '@devbookhq/react'
import { FiletreeProvider } from '@devbookhq/filesystem'

import '@devbookhq/terminal/dist/index.css'
// import '@devbookhq/code-editor/dist/index.css'

import { CompiledAppContent } from 'apps/content'
import AppContentView from './AppContentView'

export interface Props {
  content: CompiledAppContent
}

const defaultAppEnvID = '6VaSXKc5wNSr'

function AppPage({ content }: Props) {
  const sessionHandle = useSession({
    codeSnippetID: content.environmentID || content.serialized?.frontmatter?.envID || defaultAppEnvID,
    debug: process.env.NODE_ENV === 'development',
    inactivityTimeout: 0,
  })

  return (
    <SharedSessionProvider session={sessionHandle}>
      <FiletreeProvider>
        <div
          className="
        flex
        w-full
        h-full
        flex-1
        flex-col
        overflow-hidden
      "
        >
          <AppContentView
            content={content}
          />
        </div>
      </FiletreeProvider>
    </SharedSessionProvider >
  )
}

export default AppPage
