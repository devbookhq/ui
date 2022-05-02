import 'styles/global.css'

import { AppProps } from 'next/app'
import { UserProvider } from '@supabase/supabase-auth-helpers/react'
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'

import { UserContextProvider } from 'utils/useUser'
import Layout from 'components/Layout'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider supabaseClient={supabaseClient}>
      <UserContextProvider supabaseClient={supabaseClient}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </UserContextProvider>
    </UserProvider>
  )
}
