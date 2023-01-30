import { GetServerSideProps } from 'next'
import JSONCrush from 'jsoncrush'

import AppPage from 'components/AppPage'
import { Guide } from 'guides/content/Guide'

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  context.res.setHeader(
    'Cache-Control',
    'maxage'
  )

  if (typeof context.query.guide !== 'string') {
    return {
      notFound: true,
    }
  } else {
    const guide = JSON.parse(JSONCrush.uncrush(context.query.guide)) as Guide
    return {
      props: {
        guide,
      }
    }
  }
}

export interface Props {
  guide: Guide
}

function DevPage({ guide }: Props) {
  return <AppPage guide={guide} />
}

export default DevPage
