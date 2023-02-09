import type { MDXRemote } from 'next-mdx-remote'
import { ComponentProps } from 'react'

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
}

export default mdxComponents
