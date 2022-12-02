import type { AppProps } from 'next/app'
import React from 'react'
import { SharedSessionProvider } from '@devbookhq/react'

import '../../styles/index.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SharedSessionProvider opts={{ codeSnippetID: 's8GzxcGmvrpf', inactivityTimeout: 0 }}>
      <Component {...pageProps} />
    </SharedSessionProvider>
  )
}

export default MyApp
