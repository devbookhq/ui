import { useState } from 'react'
import { AppProps } from 'next/app'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react'
import { apps } from 'database'

import Layout from 'components/Layout'
import { PostHogProvider } from 'utils/PostHogProvider'


export interface Props {
  appProps: AppProps<{ app?: apps, initialSession: Session }>
}

export default function Dashboard({ appProps: { pageProps, Component } }: Props) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient())
  return (
    <PostHogProvider token={process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_POSTHOG_KEY : undefined} >
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
        <Layout app={pageProps.app}>
          <Component {...pageProps} />
        </Layout>
      </SessionContextProvider>
    </PostHogProvider >
  )
}
