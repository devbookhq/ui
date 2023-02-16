import { useSession, SharedSessionProvider } from '@devbookhq/react'
import { FiletreeProvider } from '@devbookhq/filesystem'
import { MDXRemote } from 'next-mdx-remote'

import '@devbookhq/terminal/dist/index.css'
// import '@devbookhq/code-editor/dist/index.css'

import mdxComponents from './mdxComponents'
import { CompiledAppContent } from 'apps/content'

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
    <SharedSessionProvider session={sessionHandle}>
      <FiletreeProvider>
        <div
          className="
              flex
              w-full
              App
              flex-1
              flex-col
              overflow-hidden
              "
        >
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
  )
}

export default AppPage
