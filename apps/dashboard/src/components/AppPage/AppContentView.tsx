import { MDXRemote } from 'next-mdx-remote'

import mdxComponents from './mdxComponents'
import { CompiledAppContent } from 'apps/content'

export interface Props {
  content: CompiledAppContent
}

function AppContentView({ content }: Props) {
  return (
    <div
      className="
      flex-1
      flex
      flex-col
      bg-gray-900
      text-gray-100
      overflow-auto
      scroller
    ">
      <MDXRemote
        {...content.serialized}
        components={mdxComponents}
        lazy
      />
    </div>
  )
}

export default AppContentView
