import type { GetStaticPaths, GetStaticProps } from 'next'
import type { ParsedUrlQuery } from 'querystring'

import { CompiledAppContent } from 'apps/content'
import { prisma } from 'queries/prisma'
import AppPage from 'components/AppPage'
import { AppContentJSON, compileContent } from 'apps/content'

interface PathProps extends ParsedUrlQuery {
  page: string
}

export const getStaticPaths: GetStaticPaths<PathProps> = async () => {
  return {
    paths: [],
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps<Props, PathProps> = async ({ params }) => {
  if (!params) throw new Error('No path parameters found')

  const pagePath = params?.page as any as string[]
  const subdomain = pagePath.shift()
  const page = `${pagePath.length === 0 ? 'index' : pagePath.join('/')}.mdx`

  try {
    const app = await prisma.apps.findUniqueOrThrow({
      where: {
        subdomain,
      },
      include: {
        apps_content: {
          select: {
            content: true,
          }
        }
      },
    })

    if (!app?.apps_content?.content) {
      throw new Error('App content not found')
    }

    const dbContent = app?.apps_content?.content as unknown as AppContentJSON
    const mdx = dbContent.mdx.find(n => n.name === page)?.content
    if (!mdx) {
      return {
        notFound: true
      }
    }

    const css = dbContent.css?.find(n => n.name === 'index.css')?.content

    const content = await compileContent({
      mdx,
      css,
    })

    return {
      props: {
        content,
      },
    }
  } catch (err) {
    console.error(err)
    return { notFound: true, revalidate: 10 }
  }
}

export interface Props {
  content: CompiledAppContent
}

function SubdomainApp({ content }: Props) {
  return <AppPage content={content} />
}

export default SubdomainApp
