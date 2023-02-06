import Link from 'next/link'
import { apps } from 'database'
import { useUser } from '@supabase/auth-helpers-react'

import UserPortrait from 'components/UserPortrait'
import CustomerFeedback from 'components/CustomerFeedback'

import Navigation from './Navigation'

export interface Props {
  app?: apps
}

function Header({ app }: Props) {
  const user = useUser()

  return (
    <div className="flex items-center justify-between border-b bg-white border-slate-200 px-3">
      <Navigation app={app} />
      <div className="flex items-center space-x-4">
        <CustomerFeedback />
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
