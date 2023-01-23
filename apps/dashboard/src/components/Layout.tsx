import Head from 'next/head'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'

import { App } from 'queries/types'

import Header from './Header'

export interface PageMeta {
  title: string
  description: string
  cardImage: string
}

interface Props {
  app?: App
  children: ReactNode
  meta?: PageMeta
}

export default function Layout({ children, meta: pageMeta, app }: Props) {
  const router = useRouter()
  const isEnvsDashboard = router.pathname === '/envs'
  const isProjectsDashboard = router.pathname === '/projects'
  const isProjectOpen = router.pathname === '/projects/[slug]'
  const isSettings = router.pathname === '/settings'
  const isSignIn = router.pathname === '/signin' && router.query.signup !== 'true'
  const isSignUp = router.pathname === '/signin' && router.query.signup === 'true'

  const meta = {
    title: 'Dashboard | Devbook',
    description: 'Devbook app',
    cardImage: '/og.png',
    ...pageMeta,
  }

  if (isProjectsDashboard) {
    meta.title = 'Projects | Devbook'
  } else if (app && isProjectOpen) {
    meta.title = `${app.title} - Project | Devbook`
  } else if (isEnvsDashboard) {
    meta.title = 'Envs | Devbook'
  } else if (isSignIn) {
    meta.title = 'Sign In | Devbook'
  } else if (isSignUp) {
    meta.title = 'Sign Up | Devbook'
  } else if (isSettings) {
    meta.title = 'Settings | Devbook'
  }

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta
          content="follow, index"
          name="robots"
        />
        <link
          href="/favicon.ico"
          rel="shortcut icon"
        />
        <meta
          content={meta.description}
          name="description"
        />
        <meta
          content={`https://app.usedevbook.com${router.asPath}`}
          property="og:url"
        />
        <meta
          content="website"
          property="og:type"
        />
        <meta
          content={meta.title}
          property="og:site_name"
        />
        <meta
          content={meta.description}
          property="og:description"
        />
        <meta
          content={meta.title}
          property="og:title"
        />
        <meta
          content={meta.cardImage}
          property="og:image"
        />
        <meta
          content="summary_large_image"
          name="twitter:card"
        />
        <meta
          content="@devbookhq"
          name="twitter:site"
        />
        <meta
          content={meta.title}
          name="twitter:title"
        />
        <meta
          content={meta.description}
          name="twitter:description"
        />
        <meta
          content={meta.cardImage}
          name="twitter:image"
        />
      </Head>

      <div
        className="
        flex
        w-full
        flex-1
        flex-col
        overflow-hidden
      "
      >
        {!isSignIn && !isSignUp && <Header app={app} />}
        <div
          className="
          flex
          flex-1
          flex-col
          overflow-hidden
        "
        >
          {children}
        </div>
      </div>
    </>
  )
}
