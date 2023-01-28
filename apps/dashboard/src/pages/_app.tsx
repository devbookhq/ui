import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'
import { UserProvider } from '@supabase/supabase-auth-helpers/react'
import { AppProps } from 'next/app'

import 'styles/global.css'

import Layout from 'components/Layout'
import { App as AppProp } from 'queries/db'
import { usePostHog } from 'utils/posthog/usePostHog'

export default function App({ Component, pageProps, router }: AppProps<{ app?: AppProp }>) {
  usePostHog()

  if (router.pathname === '/_sites/[site]/[slug]') {
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
    <UserProvider supabaseClient={supabaseClient}>
      <Layout app={pageProps.app}>
        <Component {...pageProps} />
      </Layout>
    </UserProvider>
  )
}
