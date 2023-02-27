import { useSession, SharedSessionProvider } from '@devbookhq/react'
import { FiletreeProvider } from '@devbookhq/filesystem'
import dynamic from 'next/dynamic'

import { CompiledAppContent } from 'apps/content'

import { AppContextProvider } from './AppContext'
const MDXRender = dynamic(() => import('./MDXRender'), { ssr: false })

export interface Props {
  content: CompiledAppContent
}

const defaultAppEnvID = '6VaSXKc5wNSr'

function AppPage({ content }: Props) {
  const sessionHandle = useSession({
    codeSnippetID: content.serialized?.frontmatter?.envID || content.environmentID || defaultAppEnvID,
    debug: process.env.NODE_ENV === 'development',
    inactivityTimeout: 0,
  })

  return (
    <AppContextProvider>
      <SharedSessionProvider session={sessionHandle}>
        <FiletreeProvider>
          <MDXRender content={content} />
        </FiletreeProvider>
      </SharedSessionProvider>
    </AppContextProvider>
  )
}

export default AppPage
