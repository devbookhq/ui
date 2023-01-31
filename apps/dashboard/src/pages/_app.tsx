import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'
import { UserProvider } from '@supabase/supabase-auth-helpers/react'
import { AppProps } from 'next/app'

import 'styles/global.css'

import Layout from 'components/Layout'
import { App as AppProp } from 'queries/db'
import { PostHogProvider } from 'utils/PostHogProvider'
import Loader from 'components/Loader'

export default function App({ Component, pageProps, router }: AppProps<{ app?: AppProp }>) {
  if (router.pathname === '/_sites/[site]/[slug]' || router.pathname === '/_sites/dev') {
    if (router.isFallback) {
      return <Loader />
    }

    return (
      <div
        className="
      flex
      w-full
      flex-1
      flex-col
      overflow-hidden
    "
      >
        <div
          className="
        flex
        flex-1
        flex-col
        overflow-hidden
      "
        >
          <Component {...pageProps} />
        </div>
      </div>
    )
  }

  return (
    <PostHogProvider token={process.env.NEXT_PUBLIC_POSTHOG_KEY}>
      <UserProvider supabaseClient={supabaseClient}>
        <Layout app={pageProps.app}>
          <Component {...pageProps} />
        </Layout>
      </UserProvider>
    </PostHogProvider>
  )
}
