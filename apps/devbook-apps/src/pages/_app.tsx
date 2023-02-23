import type { AppProps } from 'next/app'

import 'styles/global.css'

import type { apps } from 'database'
import Loader from 'components/Loader'

export default function App(props: AppProps<{ app?: apps }>) {
  return (
    <>
      {props.router.isFallback && <Loader />}
      {!props.router.isFallback && <props.Component {...props.pageProps} />}
    </>
  )
}
