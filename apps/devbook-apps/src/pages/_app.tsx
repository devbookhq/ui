import type { AppProps } from 'next/app'
import { Inter, JetBrains_Mono } from 'next/font/google'

import 'styles/global.css'

import type { apps } from 'database'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetBrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jet-brains',
})

export default function App(props: AppProps<{ app?: apps }>) {
  return (
    <main className={`${inter.variable} font-sans ${jetBrains.variable} flex h-inherit`}>
      <props.Component {...props.pageProps} />
    </main>
  )
}
