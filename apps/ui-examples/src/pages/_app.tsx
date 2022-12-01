import type { AppProps } from 'next/app'
import React from 'react'
import { SessionProvider } from '@devbookhq/react'

import '@devbookhq/code-editor/dist/index.css'
import '@devbookhq/terminal/dist/index.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider opts={{ codeSnippetID: 's8GzxcGmvrpf' }}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default MyApp
