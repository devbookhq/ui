import 'react-toastify/dist/ReactToastify.css'
import 'styles/global.css'

import Script from 'next/script'
import { AppProps } from 'next/app'
import { UserProvider } from '@supabase/supabase-auth-helpers/react'
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'

import { ToastContainer } from 'react-toastify'
import Layout from 'components/Layout'
import { UserInfoContextProvider } from 'utils/useUserInfo'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-BNSES8FS5J"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-BNSES8FS5J');
      `}
      </Script>
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
    </>
  )
}
