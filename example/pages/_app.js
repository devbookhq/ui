import { SessionProvider } from '@devbookhq/react'
import React from 'react'

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider opts={{ codeSnippetID: 's8GzxcGmvrpf' }}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default MyApp
