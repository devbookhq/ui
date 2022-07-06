import { useRouter } from 'next/router'

import TitleLink from 'components/TitleLink'
import UserIndicator from 'components/UserIndicator'
import useUserInfo from 'utils/useUserInfo'

function Navbar() {
  const router = useRouter()
  const { user } = useUserInfo()

  if (!user) return null

  return (
    <header
      className="
        flex
        flex-row
        justify-between
        items-center
    ">
      <span />

      <nav className="
        flex
        flex-row
        items-center
        space-x-6
      ">
        <TitleLink
          href={{
            pathname: '/dashboard',
          }}
          title="Dashboard"
          size={TitleLink.size.T3}
        />
        <TitleLink
          href={{
            pathname: '/dashboard/settings',
          }}
          title="Settings"
          size={TitleLink.size.T3}
        />
        <UserIndicator
          onMouseDown={() => router.push('/dashboard/settings')}
          userDisplayName={user.email}
          size={UserIndicator.size.Large}
        />
      </nav>
    </header>
  )
}


export default Navbar
