import { useUser } from 'utils/useUser';
import Link from 'components/Link'

function Navbar() {
  const { user } = useUser()

  if (!user) return null

  return (
    <header
      className="
        max-w-[1160px]
        w-full
        p-4
        flex
        flex-row
        justify-between
        items-center
    ">
      <span/>

      <nav className="
        flex
        flex-row
        space-x-4
      ">
        <Link
          href="/"
          title="Dashboard"
        />
        <Link
          href="/account"
          title="Account [todo]"
        />
      </nav>
    </header>
  )
}


export default Navbar
