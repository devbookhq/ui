import { supabaseServerClient } from '@supabase/supabase-auth-helpers/nextjs'
import { GetServerSideProps } from 'next'

import AppView from 'components/AppView'

import { getApp } from 'queries/queries'
import { App } from 'queries/types'

import { getID } from 'utils/app'

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
  return <AppView app={app} />
}

export default AppPreview
