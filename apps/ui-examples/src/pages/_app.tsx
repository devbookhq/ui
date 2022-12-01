import type { AppProps } from 'next/app'
import React from 'react'
import { SharedSessionProvider } from '@devbookhq/react'

import '@devbookhq/code-editor/dist/index.css'
import '@devbookhq/terminal/dist/index.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SharedSessionProvider opts={{ codeSnippetID: 's8GzxcGmvrpf' }}>
      <Component {...pageProps} />
    </SharedSessionProvider>
  )
}

export default MyApp
