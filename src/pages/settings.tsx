import { withPageAuth } from '@supabase/supabase-auth-helpers/nextjs'
import { useUser } from '@supabase/supabase-auth-helpers/react'

import ButtonLink from 'components/ButtonLink'
import Text from 'components/typography/Text'
import Title from 'components/typography/Title'

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
        <Title
          size={Title.size.T0}
          title="Settings"
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
          <Title
            rank={Title.rank.Secondary}
            size={Title.size.T2}
            title="Email"
          />
          <Text
            size={Text.size.S1}
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
