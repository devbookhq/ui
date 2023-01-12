import { withPageAuth } from '@supabase/supabase-auth-helpers/nextjs'
import { useUser } from '@supabase/supabase-auth-helpers/react'

import ButtonLink from 'components/ButtonLink'
import Text from 'components/typography/Text'

export const getServerSideProps = withPageAuth({
  redirectTo: '/signin',
})

function Settings() {
  const { user } = useUser()

  return (
    <div
      className="
      flex
      flex-1
      flex-col
      space-y-8
      space-x-0
      overflow-hidden
      p-12
      md:flex-row
      md:space-y-0
      md:space-x-8
      md:p-16
    "
    >
      <div className="flex items-start justify-start">
        <Text
          size={Text.size.S1}
          text="Settings"
        />
      </div>

      <div
        className="
        flex
        flex-1
        flex-col
        items-start
        space-y-4
        "
      >
        <div
          className="
        flex
        flex-col
        space-y-1
      "
        >
          <Text
            className="text-slate-400"
            size={Text.size.S3}
            text="Email"
          />
          <Text
            size={Text.size.S2}
            text={user?.email || ''}
          />
        </div>

        <div>
          <ButtonLink
            href="/api/auth/logout"
            text="Sign out"
          />
        </div>
      </div>
    </div>
  )
}

export default Settings
