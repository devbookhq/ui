import type { GetStaticPaths, GetStaticProps } from 'next'
import type { ParsedUrlQuery } from 'querystring'
import fs from 'fs/promises'

import AppPage from 'components/AppPage'
import {
  CompiledAppContent,
  compileContent,
  AppContentJSON,
} from 'apps/content'
import path from 'path'

interface PathProps extends ParsedUrlQuery {
  name: string
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
  const name = `${params!.name}.mdx`
  const filepath = path.join(process.cwd(), examplesDirectory, name)

  const appContent = {
    mdx: [
      {
        name: 'index.mdx',
        content: await fs.readFile(filepath, 'utf-8'),
      }
    ],
  } as AppContentJSON

  const content = await compileContent(appContent)

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
