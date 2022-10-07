import { ReactNode } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

import DashboardSidebar from 'components/DashboardSidebar'

export interface PageMeta {
  title: string;
  description: string;
  cardImage: string;
}

interface Props {
  children: ReactNode,
  meta?: PageMeta,
}

export default function Layout({ children, meta: pageMeta }: Props) {
  const router = useRouter()

  const isPreview = router.pathname === '/preview'

  const meta = {
    title: 'Devbook',
    description: 'Interactive app',
    cardImage: '/og.png',
    ...pageMeta
  }
  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="robots" content="follow, index" />
        <link href="/favicon.ico" rel="shortcut icon" />
        <meta content={meta.description} name="description" />
        <meta property="og:url" content={`https://app.usedevbook.com${router.asPath}`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:image" content={meta.cardImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@devbookhq" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={meta.cardImage} />
      </Head>

      <div className="
        w-full
        flex-1
        flex
        item-start
      ">
        {!isPreview && <DashboardSidebar />}
        <div className="
          p-4
          flex-1
          flex
          flex-col
        ">
          {children}
        </div>
      </div>
    </>
  )
}
