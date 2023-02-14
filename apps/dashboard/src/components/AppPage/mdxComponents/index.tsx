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
import Pre from './Pre'
import Columns from './Columns'

const Filetree = dynamic(() => import('./Filetree'), { ssr: false })
const Code = dynamic(() => import('./Code'), { ssr: false })
const Terminal = dynamic(() => import('./Terminal'), { ssr: false })

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
  Filetree,
  Code,
  Terminal,
  Columns,
}

export default mdxComponents
