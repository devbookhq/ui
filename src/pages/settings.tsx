import { CopyIcon } from '@radix-ui/react-icons'
import { withPageAuth } from '@supabase/supabase-auth-helpers/nextjs'

import ButtonLink from 'components/ButtonLink'
import Text from 'components/typography/Text'
import Title from 'components/typography/Title'

import useUserInfo from 'hooks/useUserInfo'

export const getServerSideProps = withPageAuth({
  redirectTo: '/signin',
})

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
    <div
      className="
      flex
      flex-col
      items-start
      space-y-6
    "
    >
      <Title title="Settings" />

      <div
        className="
        flex
        flex-col
        items-start
        justify-start
        space-y-2
      "
      >
        <Title
          size={Title.size.T2}
          title="Email"
        />
        <div
          className="
          flex
          flex-row
          items-center
          space-x-2
          px-2
        "
        >
          <Text
            size={Text.size.S1}
            text={user?.email || ''}
          />
        </div>

        <Title
          size={Title.size.T2}
          title="API Key"
        />
        <div
          className="
          flex
          flex-row
          items-center
          space-x-2
        "
        >
          <input
            type="text"
            value={apiKey}
            className="
              w-[300px]
              truncate
              rounded-lg
              border
              border-black-700
              bg-black-800
              px-2
              py-1
              text-sm
              text-white-900
            "
            readOnly
          />
          <div
            className="
              cursor-pointer
              rounded-lg
              p-2
              text-white-900/50
              hover:bg-black-700
              hover:text-white-900
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
