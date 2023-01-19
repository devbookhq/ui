import {
  supabaseServerClient,
  withPageAuth,
} from '@supabase/supabase-auth-helpers/nextjs'

import { getApp } from 'queries'
import { App } from 'queries/types'

import { getID } from 'utils/app'

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

function App({ app }: Props) {

  return (
    <div className="flex flex-1">
      <ResourcesSidebar />
      <Board />
    </div>
  )




}

export default App
