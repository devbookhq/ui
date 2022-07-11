import { withPageAuth } from '@supabase/supabase-auth-helpers/nextjs'

import Text from 'components/typography/Text'
import Title from 'components/typography/Title'
import ButtonLink from 'components/ButtonLink'
import CopyIcon from 'components/icons/Copy'
import useUserInfo from 'utils/useUserInfo'

export const getServerSideProps = withPageAuth({ redirectTo: '/signin' })

function Settings() {
  const { apiKey, user } = useUserInfo()

  // TODO: Handle loading
  // TODO: Handle error

  function handleCopyClick() {
    if (apiKey) {
      // TODO: Show notit that key has been copied
      navigator.clipboard.writeText(apiKey)
    }
  }

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

      <div className="
        flex
        flex-col
        items-start
        justify-start
        space-y-2
      ">
        <Title
          size={Title.size.T2}
          title="Email"
        />
        <div className="
          flex
          flex-row
          items-center
          space-x-2
          px-2
        ">
          <Text
            text={user?.email || ''}
            size={Text.size.S1}
          />
        </div>

        <Title
          size={Title.size.T2}
          title="API Key"
        />
        <div className="
          flex
          flex-row
          items-center
          space-x-2
        ">
          <input
            type="text"
            className="
              w-[300px]
              px-2
              py-1
              rounded-lg
              text-white-900
              bg-black-800
              border
              border-black-700
              truncate
            "
            value={apiKey}
            readOnly
          />
          <div
            className="
              p-2
              rounded-lg
              cursor-pointer
              text-white-900/50
              hover:text-white-900
              hover:bg-black-700
            "
            onClick={handleCopyClick}
          >
            <CopyIcon />
          </div>
        </div>
      </div>

      <ButtonLink
        href="/api/auth/logout"
        text="Sign Out"
      />
    </div>
  )
}

export default Settings
