import { ReactNode } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Navbar from 'components/Navbar'
//import Footer from 'components/ui/Footer';
// import { PageMeta } from '../types';

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
  const meta = {
    title: 'Devbook',
    description: 'Interactive code snippets',
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
          <meta property="og:url" content={`https://dash.usedevbook.com${router.asPath}`} />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content={meta.title} />
          <meta property="og:description" content={meta.description} />
          <meta property="og:title" content={meta.title} />
          <meta property="og:image" content={meta.cardImage} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@vercel" />
          <meta name="twitter:title" content={meta.title} />
          <meta name="twitter:description" content={meta.description} />
          <meta name="twitter:image" content={meta.cardImage} />
        </Head>

        <div className="
          p-4
          flex-1
          flex
          flex-col
          max-w-[1160px]
          w-full
        ">
          <Navbar/>
          {children}
          {/*<Footer/>*/}
        </div>
      </>
  );
}

