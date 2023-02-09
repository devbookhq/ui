import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import path from 'path-browserify'
import { notEmpty } from 'utils/notEmpty'

export interface AppContentJSON {
  env?: {
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
  environmentID?: string
  layout: Layout | null
  serialized: MDXRemoteSerializeResult
  componentNames: string[]
}

function checkMDXComponents(source: string, components: string[]) {
  return components.map(c => source.indexOf(`_jsxDEV(${c}`) >= 0 ? c : null).filter(notEmpty)
}

export async function compileContent(content: AppContentJSON): Promise<CompiledAppContent> {
  const indexMDX = content.mdx.find(m => path.basename(m.name) === 'index.mdx')

  if (!indexMDX) {
    throw new Error('Cannot find "index.mdx"')
  }

  const serialized = await serialize(indexMDX.content, { parseFrontmatter: true })
  const componentNames = checkMDXComponents(serialized.compiledSource, ['CodeBlock', 'TerminalCommand'])

  return {
    serialized,
    componentNames,
    environmentID: content.env?.id,
    title: serialized.frontmatter?.title,
    layout: serialized.frontmatter?.layout as unknown as Layout || null,
  }
}
