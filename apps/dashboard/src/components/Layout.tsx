import Head from 'next/head'
import { useRouter } from 'next/router'
import { ReactNode, useEffect } from 'react'
import { useUser } from '@supabase/auth-helpers-react'
import { posthog } from 'posthog-js'

import { apps } from 'database'

import Header from './Header'

export interface PageMeta {
  title: string
  description: string
  cardImage: string
}

interface Props {
  app?: apps
  children: ReactNode
  meta?: PageMeta
}

export default function Layout({ children, meta: pageMeta, app }: Props) {
  const router = useRouter()
  const isProjectsDashboard = router.pathname === '/projects'
  const isProjectOpen = router.pathname === '/projects/[id]'
  const isNewProject = router.pathname === '/new/project'
  const isSettings = router.pathname === '/settings'
  const isSignIn = router.pathname === '/sign' && router.query.signup !== 'true'
  const isSignUp = router.pathname === '/sign' && router.query.signup === 'true'

  const meta = {
    title: 'Dashboard | Devbook',
    description: 'Devbook Dashboard',
    cardImage: '/og.png',
    ...pageMeta,
  }

  const user = useUser()

  useEffect(function identify() {
    if (user?.email) {
      posthog.identify(user.email, {
        email: user.email,
      })
    }
  }, [user?.email])

  if (isProjectsDashboard) {
    meta.title = 'Projects | Devbook'
  } else if (app && isProjectOpen) {
    meta.title = `${app.title} - Project | Devbook`
  } else if (isSignIn) {
    meta.title = 'Sign In | Devbook'
  } else if (isSignUp) {
    meta.title = 'Sign Up | Devbook'
  } else if (isSettings) {
    meta.title = 'Settings | Devbook'
  } else if (isNewProject) {
    meta.title = 'New Project | Devbook'
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
        {!isSignIn && !isSignUp &&
          <Header app={app} />
        }
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
