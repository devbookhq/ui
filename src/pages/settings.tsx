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
      items-start
      space-x-4
      p-16
    "
    >
      <Title
        size={Title.size.T0}
        title="Settings"
      />

      <div
        className="
        flex
        flex-1
        flex-col
        space-y-4
        border-l
        border-gray-200
        pl-4
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
