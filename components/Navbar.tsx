import { useUser } from 'utils/useUser'
import Link from 'components/Link'

function Navbar() {
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
        space-x-8
      ">
        <Link
          href="/"
          title="Home"
        />
        <Link
          href="/settings"
          title="Settings"
        />

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
      </nav>
    </header>
  )
}


export default Navbar
