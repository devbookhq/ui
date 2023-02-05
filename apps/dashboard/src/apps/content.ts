import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import path from 'path-browserify'

export interface AppContentJSON {
  env: {
    id: string,
  }
  mdx: {
    name: string
    content: string
  }[]
}

export interface Layout {
  type: 'Code'
}

export interface CodeLayout extends Layout {
  props: {
    tabs: {
      path: string
    }[]
  }
}

export interface CompiledAppContent {
  title?: string
  environmentID: string
  layout: Layout | null
  serialized: MDXRemoteSerializeResult
}

export async function compileContent(content: AppContentJSON): Promise<CompiledAppContent> {
  const indexMDX = content.mdx.find(m => path.basename(m.name) === 'index.mdx')

  if (!indexMDX) {
    throw new Error('Cannot find "index.mdx"')
  }

  const serialized = await serialize(indexMDX.content, { parseFrontmatter: true })

  return {
    serialized,
    environmentID: content.env.id,
    title: serialized.frontmatter?.title,
    layout: serialized.frontmatter?.layout as unknown as Layout || null,
  }
}
