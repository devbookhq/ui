import type { GetStaticPaths, GetStaticProps } from 'next'
import type { ParsedUrlQuery } from 'querystring'

import { Guide } from 'guides/content/Guide'
import { getGuideEntry, supabaseAdmin } from 'queries/admin'
import { getGuideData } from 'guides/content'
import AppPage from 'components/AppPage'

interface PathProps extends ParsedUrlQuery {
  site: string
  slug: string
}

export const getStaticPaths: GetStaticPaths<PathProps> = async () => {
  return {
    paths: [],
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps<Props, PathProps> = async ({ params }) => {
  if (!params) throw new Error('No path parameters found')

  const { site, slug } = params

  try {
    const guideEntry = await getGuideEntry(supabaseAdmin, site, slug)
    const guide = await getGuideData(guideEntry)

    return {
      props: {
        guide,
        guideEntry,
      },
    }
  } catch (err) {
    console.error(err)
    return { notFound: true, revalidate: 10 }
  }
}

export interface Props {
  guide: Guide
}

function SitePage({ guide }: Props) {
  return <AppPage guide={guide} />
}

export default SitePage
