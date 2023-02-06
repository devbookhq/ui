import { useState } from 'react'
import { AppProps } from 'next/app'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react'
import { apps } from 'database'

import 'styles/global.css'

import Layout from 'components/Layout'
import { PostHogProvider } from 'utils/PostHogProvider'
import Loader from 'components/Loader'
import { hiddenAppRoute } from 'utils/constants'

export default function App({ Component, pageProps, router }: AppProps<{ app?: apps, initialSession: Session }>) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient())

  if (router.pathname === `/${hiddenAppRoute}/[subdomain]` || router.pathname === `/${hiddenAppRoute}/dev`) {
    if (router.isFallback) return <Loader />
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
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
        <Layout app={pageProps.app}>
          <Component {...pageProps} />
        </Layout>
      </SessionContextProvider>
    </PostHogProvider>
  )
}
