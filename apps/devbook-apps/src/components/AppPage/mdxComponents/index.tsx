import type { MDXRemote } from 'next-mdx-remote'
import { ComponentProps } from 'react'

import {
  a,
  code,
} from './base'
import Pre from './Pre'
import Columns from './Columns'
import Navigate from './Navigate'
import Highlight from './Highlight'
import Output from './Output'
import Input from './Input'
import Run from './Run'
import Code from './Code'
import Terminal from './Terminal'
import Filetree from './Filetree'

const mdxComponents: ComponentProps<typeof MDXRemote>['components'] = {
  a,
  code,
  pre: Pre,
  Filetree,
  Code,
  Output,
  Terminal,
  Run,
  Highlight,
  Columns,
  Input,
  Navigate,
}

export default mdxComponents
