import { supabaseServerClient } from '@supabase/supabase-auth-helpers/nextjs'
import { GetServerSideProps } from 'next'
import { App } from 'types'

import Preview from 'components/Preview'

import { getApp } from 'utils/queries'

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

    const splits = slug.split('-')
    const id = splits[splits.length - 1]
    if (!id) {
      return {
        notFound: true,
      }
    }

    // Try to get an app from the DB based on a ID in the slug.
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
  return <Preview serializedApp={app.serialized} />
}

export default AppPreview
