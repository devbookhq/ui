import { MDXRemote } from 'next-mdx-remote'
import dynamic from 'next/dynamic'

import mdxComponents from './mdxComponents'
import { CompiledAppContent } from 'apps/content'

const CodeBlock = dynamic(() => import('./mdxComponents/CodeBlock'), { ssr: false })
const TerminalCommand = dynamic(() => import('./mdxComponents/TerminalCommand'), { ssr: false })

export interface Props {
  content: CompiledAppContent
}

function AppContentView({ content }: Props) {
  return (
    <div className="
      flex-1
      flex
      bg-gray-900
      text-gray-100
      overflow-hidden
    ">
      <div className="
        pr-1
        flex-1
        flex
        flex-col
        justify-between
        overflow-hidden
        border-r
        border-gray-800
      ">
        <div
          className="
          pt-10
          pl-3
          pb-16
          self-stretch
          flex
          flex-col
          overflow-auto
          instructions-scrollbar
          scrollbar-gutter
        "
        >
          <div className="
            self-stretch
            pb-8
            prose
            prose-slate
            mx-auto
          ">
            <MDXRemote
              {...content.serialized}
              components={{
                ...mdxComponents,
                CodeBlock: content.componentNames.includes('CodeBlock') ? CodeBlock : null as any,
                TerminalCommand: content.componentNames.includes('TerminalCommand') ? TerminalCommand : null as any,
              }}
              lazy
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppContentView
