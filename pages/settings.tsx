import Link from 'next/link'
import { withAuthRequired } from '@supabase/supabase-auth-helpers/nextjs'
import Title from 'components/typography/Title'

export const getServerSideProps = withAuthRequired({ redirectTo: '/signin' })
function Settings() {

  return (
    <div className="flex flex-col">
      <Title>Settings</Title>

      <Link href="/api/auth/logout">
        <a>Sign out</a>
      </Link>
    </div>
  )
}

export default Settings
