import { supabaseServerClient } from '@supabase/supabase-auth-helpers/nextjs'
import { GetServerSideProps } from 'next'

import Preview from 'components/Preview'

import { getID } from 'utils/appID'
import { getApp } from 'utils/queries/queries'
import { App } from 'utils/queries/types'

export const getServerSideProps: GetServerSideProps = async ctx => {
  try {
    const {
      slug,
    }: {
      slug?: string
    } = ctx.query
    if (!slug) {
      return {
        notFound: true,
      }
    }

    const id = getID(slug)
    if (!id) {
      return {
        notFound: true,
      }
    }

    const app = await getApp(supabaseServerClient(ctx), id)
    if (!app) {
      return {
        notFound: true,
      }
    }

    return {
      props: {
        app,
      },
    }
  } catch (err: any) {
    return {
      props: {
        error: err.message,
      },
    }
  }
}

interface Props {
  app: App
}

function AppPreview({ app }: Props) {
  return <Preview app={app} />
}

export default AppPreview
