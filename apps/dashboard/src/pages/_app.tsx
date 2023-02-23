import type { AppProps } from 'next/app'
import type { Session } from '@supabase/auth-helpers-react'

import 'styles/global.css'

import type { apps } from 'database'
import Dashboard from 'components/Dashboard'

export default function App(props: AppProps<{ app?: apps, initialSession: Session }>) {
  return (
    <Dashboard appProps={props} />
  )
}
