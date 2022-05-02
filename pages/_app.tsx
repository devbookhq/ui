import 'styles/global.css'

import { AppProps } from 'next/app'
import { UserProvider } from '@supabase/supabase-auth-helpers/react'
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'

import Layout from 'components/Layout'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider supabaseClient={supabaseClient}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserProvider>
  )
}
