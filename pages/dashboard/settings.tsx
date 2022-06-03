import { withPageAuth } from '@supabase/supabase-auth-helpers/nextjs'

import Title from 'components/typography/Title'
import ButtonLink from 'components/ButtonLink'
import { useUser } from 'utils/useUser'
import useAPIKey from 'utils/useAPIKey'
import CopyIcon from 'components/icons/Copy'

export const getServerSideProps = withPageAuth({ redirectTo: '/signin' })
function Settings() {
  const { user } = useUser()
  const { key, error, isLoading } = useAPIKey(user?.id)

  // TODO: Handle loading
  // TODO: Handle error

  function handleCopyClick() {
    navigator.clipboard.writeText(key)
    // TODO: Show notit that key has been copied
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
            value={key}
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
