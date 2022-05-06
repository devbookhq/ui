import Link from 'next/link'
import { withAuthRequired } from '@supabase/supabase-auth-helpers/nextjs'
import Title from 'components/typography/Title'
import ButtonLink from 'components/ButtonLink'

export const getServerSideProps = withAuthRequired({ redirectTo: '/signin' })
function Settings() {
  return (
    <div className="
      flex
      flex-col
      items-start
      space-y-6
    ">
      <div className="
        min-h-[48px]
        flex
        justify-start
      ">
        <Title
          title="Settings"
        />
      </div>

      <ButtonLink
        href="/api/auth/logout"
        text="Sign Out"
      />
    </div>
  )
}

export default Settings
