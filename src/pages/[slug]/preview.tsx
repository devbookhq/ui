import { supabaseServerClient } from '@supabase/supabase-auth-helpers/nextjs'
import { useUser } from '@supabase/supabase-auth-helpers/react'
import { GetServerSideProps } from 'next'

import AppView from 'components/AppView'
import EditorPreviewSwitch from 'components/EditorPreviewSwitch'

import { getID } from 'utils/app'
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
  const { user } = useUser()

  return (
    <>
      <AppView app={app} />
      {user && <EditorPreviewSwitch className="fixed top-4 right-4" />}
    </>
  )
}

export default AppPreview
