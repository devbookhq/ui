import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'
import { UserProvider } from '@supabase/supabase-auth-helpers/react'
import { AppProps } from 'next/app'

import 'styles/global.css'

import Layout from 'components/Layout'
import { App as AppProp } from 'queries/types'

export default function App({ Component, pageProps }: AppProps<{ app?: AppProp }>) {
  return (
    <UserProvider supabaseClient={supabaseClient}>
      <Layout app={pageProps.app}>
        <Component {...pageProps} />
      </Layout>
    </UserProvider>
  )
}
