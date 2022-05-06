import { useUser } from 'utils/useUser'
import TitleLink from 'components/TitleLink'

function Navbar() {
  const { user } = useUser()

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
          title="Home"
          size={TitleLink.size.T3}
        />
        <TitleLink
          href="/dashboard/settings"
          title="Settings"
          size={TitleLink.size.T3}
        />

        {/*
        <div
          className="
            relative
            w-[28px]
            h-[28px]
            bg-cover
            bg-no-repeat
            bg-center
            rounded-[100%]
          "
          style={{
            backgroundImage: `url(${userDetails?.avatar_url})`,
          }}
        />
        */}
      </nav>
    </header>
  )
}


export default Navbar
