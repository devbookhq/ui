import Head from 'next/head'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'

import DashboardSidebar from 'components/DashboardSidebar'

export interface PageMeta {
  title: string
  description: string
  cardImage: string
}

interface Props {
  children: ReactNode
  meta?: PageMeta
}

export default function Layout({ children, meta: pageMeta }: Props) {
  const router = useRouter()

  const isPreview = router.pathname === '/preview'

  const meta = {
    title: 'Devbook',
    description: 'Interactive app',
    cardImage: '/og.png',
    ...pageMeta,
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
        item-start
        flex
        w-full
        flex-1
      "
      >
        {!isPreview && <DashboardSidebar />}
        <div
          className="
          flex
          flex-1
          flex-col
          p-4
        "
        >
          {children}
        </div>
      </div>
    </>
  )
}
