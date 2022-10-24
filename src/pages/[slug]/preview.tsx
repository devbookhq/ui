import { supabaseServerClient } from '@supabase/supabase-auth-helpers/nextjs'
import { useUser } from '@supabase/supabase-auth-helpers/react'
import { GetServerSideProps } from 'next'

import AppView from 'components/AppView'
import EditorPreviewSwitch from 'components/EditorPreviewSwitch'

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
  const { user } = useUser()

  if (error) return <div>{error}</div>
  if (!app) return <div>App not found</div>

  return (
    <>
      <AppView state={app.state} />
      {user && <EditorPreviewSwitch className="fixed top-4 right-4" />}
    </>
  )
}

export default AppPreview
