import type { MDXRemote } from 'next-mdx-remote'
import { ComponentProps } from 'react'
import dynamic from 'next/dynamic'

import {
  a,
  code,
} from './base'
import Pre from './Pre'
import Columns from './Columns'
import Navigate from './Navigate'
import Highlight from './Highlight'
import Output from './Output'

// import Code from './Code'
const Code = dynamic(() => import('./Code'), { ssr: false })
const Filetree = dynamic(() => import('./Filetree'), { ssr: false })
const Terminal = dynamic(() => import('./Terminal'), { ssr: false })

const mdxComponents: ComponentProps<typeof MDXRemote>['components'] = {
  a,
  code,
  pre: Pre,
  Filetree,
  Code,
  Output,
  Terminal,
  Highlight,
  Columns,
  Navigate,
}

export default mdxComponents