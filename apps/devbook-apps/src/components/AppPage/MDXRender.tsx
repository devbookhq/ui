import { CompiledAppContent } from 'apps/content'
import { MDXRemote } from 'next-mdx-remote'

import mdxComponents from './mdxComponents'

export interface Props {
  content: CompiledAppContent
}

function MDXRender({ content }: Props) {
  return (
    <div
      className="
            min-h-[100vh]
            min-w-[100vw]
            overflow-hidden
            bg-slate-100
          ">
      <MDXRemote
        {...content.serialized}
        components={mdxComponents}
      />
      <style jsx global>
        {`${content.css}`}
      </style>
    </div>
  )
}

export default MDXRender
