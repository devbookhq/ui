import { useSession, SharedSessionProvider } from '@devbookhq/react'
import { FiletreeProvider } from '@devbookhq/filesystem'
import { MDXRemote } from 'next-mdx-remote'

import '@devbookhq/terminal/dist/index.css'
// import '@devbookhq/code-editor/dist/index.css'

import mdxComponents from './mdxComponents'
import { CompiledAppContent } from 'apps/content'
import { AppContextProvider } from './AppContext'

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
          <div
            className="
            min-h-[100vh]
            min-w-[100vw]
            overflow-hidden
            bg-slate-50
          ">
            <MDXRemote
              {...content.serialized}
              components={mdxComponents}
            />
            <style jsx global>
              {`${content.css}`}
            </style>
          </div>
        </FiletreeProvider>
      </SharedSessionProvider>
    </AppContextProvider>
  )
}

export default AppPage
