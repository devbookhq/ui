import Link from 'next/link'
import { withAuthRequired } from '@supabase/supabase-auth-helpers/nextjs'


export default function Home() {
  return (
    <div>
      <p>Dashboard</p>

      <Link href="/api/auth/logout">
        <a>Sign out</a>
      </Link>
    </div>
  )
}

// export const getServerSideProps = withAuthRequired({ redirectTo: '/signin' })
