import {
  supabaseServerClient,
  withPageAuth,
} from '@supabase/supabase-auth-helpers/nextjs'

import AppEditor from 'components/AppEditor'

import { getID } from 'utils/app'
import { getApp } from 'utils/queries/queries'
import { App } from 'utils/queries/types'

export const getServerSideProps = withPageAuth({
  redirectTo: '/signin',
  async getServerSideProps(ctx) {
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
  },
})

interface Props {
  app: App
}

function Edit({ app }: Props) {
  return <AppEditor app={app} />
}

export default Edit
