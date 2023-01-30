import { GetServerSideProps } from 'next'
import getRawBody from 'raw-body'


import AppPage from 'components/AppPage'
import { Guide } from 'guides/content/Guide'

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  // context.res.setHeader(
  //   'Cache-Control',
  //   'maxage'
  // )
  // return {
  //   props: {
  //     guide: test as any,
  //   }
  // }

  // if (context.req.method === 'GET') {
  // https://github.com/vercel/next.js/discussions/12152
  const body = await getRawBody(context.req)
  const stringBody = body.toString()
  console.log('BODY >>>>>>>>>>>>>>>>>>>', stringBody)
  const jsonBody = JSON.parse(stringBody)
  console.log('JSON >>>>>>>>>>>>>>>>>>>', jsonBody)

  return {
    props: {
      guide: JSON.parse(body.toString())
    }
  }
}

export interface Props {
  guide: Guide
}

function DevPage({ guide }: Props) {
  console.log({ guide })
  return <AppPage guide={guide} />
}

export default DevPage
