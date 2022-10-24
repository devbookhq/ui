import { supabaseServerClient } from '@supabase/supabase-auth-helpers/nextjs'
import { GetServerSideProps } from 'next'

import AppView from 'components/AppView'

import { getApp } from 'queries'
import { App } from 'queries/types'

import { getID } from 'utils/app'

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
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

    if (!app.deployed_state) {
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
  app?: App
  error?: string
}

function AppPreview({ app, error }: Props) {
  if (error) return <div>{error}</div>
  if (!app) return <div>App not found</div>
  if (!app.deployed_state) return <div>App is not deployed</div>

  return <AppView state={app.deployed_state} />
}

export default AppPreview
