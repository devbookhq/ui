import { GetServerSideProps } from 'next'
import getRawBody from 'raw-body'

import AppPage from 'components/AppPage'
import { Guide } from 'guides/content/Guide'
import { getGuideData } from 'guides/content'
import { GuideDBEntry } from 'queries/db'

// TODO: Add realtime reloading on changes
// https://dev.to/cassiolacerda/automatically-refresh-the-browser-on-node-express-server-changes-x1f680-1k0o#comment-1kjdg
export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  // TODO: Check the cached requests validity
  context.res.setHeader(
    'Cache-Control',
    'maxage'
  )

  // https://github.com/vercel/next.js/discussions/12152
  const body = await getRawBody(context.req)
  const stringBody = body.toString()
  const jsonBody = JSON.parse(stringBody) as GuideDBEntry
  const guide = await getGuideData(jsonBody)

  return {
    props: {
      guide,
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
