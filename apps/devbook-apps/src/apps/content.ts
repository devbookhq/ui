import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'

export interface AppContentJSON {
  env?: {
    id: string,
  }
  mdx: {
    name: string
    content: string
  }[]
  css?: {
    name: string
    content: string
  }[]
}


export interface AppPageContent {
  mdx: string
  css?: string
  env?: {
    id: string,
  }
}


export interface CompiledAppContent {
  environmentID?: string
  serialized: MDXRemoteSerializeResult
  css?: string
}

export async function compileContent(content: AppPageContent): Promise<CompiledAppContent> {
  const serialized = await serialize(content.mdx, { parseFrontmatter: true })

  return {
    serialized,
    css: content.css,
    environmentID: content.env?.id,
  }
}
