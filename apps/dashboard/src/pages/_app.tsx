import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'
import { UserProvider } from '@supabase/supabase-auth-helpers/react'
import { AppProps } from 'next/app'

import 'styles/global.css'

import Layout from 'components/Layout'
import { App as AppProp } from 'queries/db'
import { usePostHog } from 'utils/posthog/usePostHog'

export default function App({ Component, pageProps }: AppProps<{ app?: AppProp }>) {
  usePostHog()
  return (
    <UserProvider supabaseClient={supabaseClient}>
      <Layout app={pageProps.app}>
        <Component {...pageProps} />
      </Layout>
    </UserProvider>
  )
}
