import { useRouter } from 'next/router'

import TitleLink from 'components/TitleLink'
import UserIndicator from 'components/UserIndicator'
import useUserInfo from 'utils/useUserInfo'

function Navbar() {
  const router = useRouter()
  const { user, userDetails } = useUserInfo()

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

        {userDetails?.avatar_url &&
          <div
            className="
            relative
            w-[32px]
            h-[32px]
            bg-cover
            bg-no-repeat
            bg-center
            rounded-[100%]
            cursor-pointer
            border-2
            border-white-900
            hover:border-green-500
            hover:shadow-lg
            hover:shadow-green-500/50
          "
            style={{
              backgroundImage: `url(${userDetails?.avatar_url})`,
            }}
            onMouseDown={() => router.push('/dashboard/settings')}
          />
        }
        {!userDetails?.avatar_url &&
          <UserIndicator
            onMouseDown={() => router.push('/dashboard/settings')}
            userDisplayName={user.email}
            size={UserIndicator.size.Large}
          />
        }
      </nav>
    </header>
  )
}


export default Navbar
