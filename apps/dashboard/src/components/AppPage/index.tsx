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
    codeSnippetID: content.environmentID || content.serialized?.frontmatter?.envID || defaultAppEnvID,
    debug: process.env.NODE_ENV === 'development',
    inactivityTimeout: 0,
  })

  const css = content.css

  return (
    <AppContextProvider>
      <SharedSessionProvider session={sessionHandle}>
        <FiletreeProvider>
          <div
            className="
            min-h-[100vh]
            min-w-[100vw]
            overflow-hidden
          bg-green-500
          ">
            <MDXRemote
              {...content.serialized}
              components={mdxComponents}
            />
            <style jsx global>
              {`${css}`}
            </style>
          </div>
        </FiletreeProvider>
      </SharedSessionProvider>
    </AppContextProvider>
  )
}

export default AppPage
