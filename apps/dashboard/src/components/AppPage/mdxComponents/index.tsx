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
import Iframe from './Iframe'
import Horizontal from './Horizontal'

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
  Iframe,
  Check,
  Filetree(p) {
    return <div>Filetree</div>
  },
  Code,
  Terminal,
  Horizontal,
}

export default mdxComponents
