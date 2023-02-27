import type { GetStaticPaths, GetStaticProps } from 'next'
import type { ParsedUrlQuery } from 'querystring'
import fs from 'fs/promises'
import path from 'path'

import AppPage from 'components/AppPage'
import {
  CompiledAppContent,
  compileContent,
} from 'apps/content'

const examplesDirectory = 'examples'

interface PathProps extends ParsedUrlQuery {
  page: string[]
}

export const getStaticPaths: GetStaticPaths<PathProps> = async () => {
  const dirpath = path.join(process.cwd(), examplesDirectory)
  const examplesDir = await fs.readdir(dirpath, { withFileTypes: true })
  const pages = examplesDir.filter(e => e.isDirectory).map(e => e.name)

  // TODO: Build examples pages for all mdx files, not just index.mdx.
  return {
    paths: pages.map(page => ({ params: { page: [page] } })),
    fallback: 'blocking',
  }
}

// https://github.com/hashicorp/next-mdx-enhanced may be a bette fit for out layout needs
export const getStaticProps: GetStaticProps<Props, PathProps> = async ({ params }) => {
  const pagePath = params?.page
  if (!pagePath) {
    return {
      notFound: true
    }
  }

  const filename = pagePath.length === 1 ? 'index' : pagePath.pop()

  const dirpath = path.join(process.cwd(), examplesDirectory)
  const cssPath = path.join(dirpath, ...pagePath, 'index.css')
  const mdxPath = path.join(dirpath, ...pagePath, `${filename}.mdx`)

  const mdx = await fs.readFile(mdxPath, 'utf-8')
  let css: string | undefined
  try {
    css = await fs.readFile(cssPath, 'utf-8')
  } catch (err) {
    // ignore
  }

  const content = await compileContent({
    mdx,
    css,
  })

  return {
    props: {
      content,
    }
  }
}

export interface Props {
  content: CompiledAppContent
}

function TestApp({ content }: Props) {
  return <AppPage content={content} />
}

export default TestApp
