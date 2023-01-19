import { useUser } from '@supabase/supabase-auth-helpers/react'
import Link from 'next/link'

import UserPortrait from 'components/UserPortrait'

import { App } from 'queries/types'

import Navigation from './Navigation'

export interface Props {
  app?: App
}

function Header({ app }: Props) {
  const { user } = useUser()

  return (
    <div className="flex items-center justify-between border-b border-slate-200 px-3">
      <Navigation app={app} />
      <div className="flex items-center space-x-4">
        <Link
          href={{
            pathname: '/settings',
          }}
        >
          <UserPortrait username={user?.email} />
        </Link>
      </div>
    </div>
  )
}

export default Header
