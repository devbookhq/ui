import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'
import { UserProvider } from '@supabase/supabase-auth-helpers/react'
import { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'styles/global.css'

import Layout from 'components/Layout'

import { App as AppProp } from 'utils/queries/types'

export default function App({ Component, pageProps }: AppProps<{ app?: AppProp }>) {
  return (
    <UserProvider supabaseClient={supabaseClient}>
      <Layout app={pageProps.app}>
        <Component {...pageProps} />
        <ToastContainer
          autoClose={false}
          draggable={false}
          newestOnTop={false}
          position="bottom-right"
          rtl={false}
          theme="light"
          closeOnClick
          pauseOnFocusLoss
        />
      </Layout>
    </UserProvider>
  )
}
