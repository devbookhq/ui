import type { GetStaticPaths, GetStaticProps } from 'next'
import type { ParsedUrlQuery } from 'querystring'
import fs from 'fs/promises'

import AppPage from 'components/AppPage'
import {
  CompiledAppContent,
  compileContent,
} from 'apps/content'
import path from 'path'

interface PathProps extends ParsedUrlQuery {
  page: string
}

export const getStaticPaths: GetStaticPaths<PathProps> = async () => {
  return {
    paths: [],
    fallback: true,
  }
}

const examplesDirectory = 'examples'

// https://github.com/hashicorp/next-mdx-enhanced may be a bette fit for out layout needs
export const getStaticProps: GetStaticProps<Props, PathProps> = async ({ params }) => {
  const pagePath = params?.page as any as string[]
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
