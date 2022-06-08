import 'react-toastify/dist/ReactToastify.css'
import 'styles/global.css'

import { AppProps } from 'next/app'
import { UserProvider } from '@supabase/supabase-auth-helpers/react'
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'

import { ToastContainer } from 'react-toastify'
import Layout from 'components/Layout'
import { UserInfoContextProvider } from 'utils/useUserInfo'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider supabaseClient={supabaseClient}>
      <UserInfoContextProvider>
        <Layout>
          <Component {...pageProps} />
          <ToastContainer
            position="bottom-right"
            theme="dark"
            autoClose={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable={false}
          />
        </Layout>
      </UserInfoContextProvider>
    </UserProvider>
  )
}
