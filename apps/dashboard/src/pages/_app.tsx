import type { AppProps } from 'next/app'
import type { apps } from 'database'
import type { Session } from '@supabase/auth-helpers-react'
import dynamic from 'next/dynamic'

import 'styles/global.css'

import Loader from 'components/Loader'
import { examplesRoute, hiddenAppRoute } from 'utils/constants'

const Dashboard = dynamic(() =>
  import('components/Dashboard')
)

export default function App(props: AppProps<{ app?: apps, initialSession: Session }>) {
  return (
    <>
      {(props.router.pathname.includes(hiddenAppRoute) || props.router.pathname.includes(examplesRoute))
        ? <>
          {props.router.isFallback && <Loader />}
          {!props.router.isFallback && <props.Component {...props.pageProps} />}
        </>
        : <Dashboard appProps={props} />
      }
    </>
  )
}
