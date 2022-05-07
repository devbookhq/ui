import { useRouter } from 'next/router'

import { useUser } from 'utils/useUser'
import TitleLink from 'components/TitleLink'

function Navbar() {
  const router = useRouter()
  const { user, userDetails } = useUser()

  if (!user) return null

  return (
    <header
      className="
        flex
        flex-row
        justify-between
        items-center
    ">
      <span/>

      <nav className="
        flex
        flex-row
        items-center
        space-x-6
      ">
        <TitleLink
          href="/dashboard"
          title="Dashboard"
          size={TitleLink.size.T3}
        />
        <TitleLink
          href="/dashboard/settings"
          title="Settings"
          size={TitleLink.size.T3}
        />

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
          onClick={() => router.push('/dashboard/settings')}
        />
      </nav>
    </header>
  )
}


export default Navbar
