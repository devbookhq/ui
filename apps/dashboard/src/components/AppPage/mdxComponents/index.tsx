import type { MDXRemote } from 'next-mdx-remote'
import { ComponentProps } from 'react'
import dynamic from 'next/dynamic'

import {
  a,
  code,
  h1,
  h2,
  h3,
  hr,
  li,
  p,
  strong,
} from './base'
import Check from './Check'
import Pre from './Pre'

const CodeBlock = dynamic(() => import('./CodeBlock'), { ssr: false })
const TerminalCommand = dynamic(() => import('./TerminalCommand'), { ssr: false })

const mdxComponents: ComponentProps<typeof MDXRemote>['components'] = {
  a,
  code,
  h1,
  h2,
  h3,
  hr,
  li,
  p,
  pre: Pre,
  strong,
  Check,
  Filetree(p) {
    return <div>Filetree</div>
  },
  CodeBlock,
  TerminalCommand,
}

export default mdxComponents
