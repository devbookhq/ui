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
import Navigate from './Navigate'

const Filetree = dynamic(() => import('./Filetree'), { ssr: false })
const Code = dynamic(() => import('./Code'), { ssr: false })
const Terminal = dynamic(() => import('./Terminal'), { ssr: false })

const mdxComponents: ComponentProps<typeof MDXRemote>['components'] = {
  h1,
  h2,
  h3,
  a,
  hr,
  li,
  p,
  strong,
  code,
  pre: Pre,
  Filetree,
  Code,
  Terminal,
  Columns,
  Navigate,
}

export default mdxComponents
