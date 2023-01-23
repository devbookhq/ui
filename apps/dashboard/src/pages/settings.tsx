import { withPageAuth } from '@supabase/supabase-auth-helpers/nextjs'
import { useUser } from '@supabase/supabase-auth-helpers/react'
import { ClipboardCheck, ClipboardCopy, Settings as SettingsIcon } from 'lucide-react'

import ButtonLink from 'components/ButtonLink'
import Button from 'components/Button'
import Spinner from 'components/icons/Spinner'
import Text from 'components/typography/Text'
import useAPIKey from 'hooks/useAPIKey'
import useExpiringState from 'hooks/useExpiringState'

export const getServerSideProps = withPageAuth({
  redirectTo: '/signin',
})

function Settings() {
  const { user, isLoading: isUserLoading } = useUser()
  const { key, isLoading: isAPIKeyLoading } = useAPIKey(user?.id)

  const [copied, setWasCopied] = useExpiringState({ defaultValue: false, timeout: 2000 })

  async function handleCopyAPIKey() {
    if (key) {
      await navigator.clipboard.writeText(key)
      setWasCopied(true)
    }
  }

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
        <div className="items-center flex space-x-2">
          <SettingsIcon size="30px" />
          <Text
            size={Text.size.S1}
            text="Settings"
          />
        </div>
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
          {isUserLoading
            ? <Spinner />
            : <Text
              size={Text.size.S2}
              text={user?.email!}
            />
          }
        </div>
        {/* <div
          className="
        flex
        flex-col
        space-y-1
      "
        >
          <Text
            className="text-slate-400"
            size={Text.size.S3}
            text="Slack Integration"
          />

          <ButtonLink
            href="/api/slack/install"
            text="Add to Slack"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                style={{ height: '16px', width: '16px' }}
                viewBox="0 0 122.8 122.8"
              >
                <path
                  d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z" fill="#e01e5a"></path><path d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z" fill="#36c5f0"></path><path d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z" fill="#2eb67d"></path><path d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z"
                    fill="#ecb22e"
                  >
                </path>
              </svg>
            }
          />
        </div> */}
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
            text="API Key"
          />
          {isAPIKeyLoading
            ? <Spinner />
            : <Button
              className="select-text transition-all"
              icon={copied ? <ClipboardCheck size="14px" /> : <ClipboardCopy size="14px" />}
              text={key}
              onClick={handleCopyAPIKey}
            />
          }
        </div>

        <div className="pt-2">
          <ButtonLink
            href="/api/auth/logout"
            text="Sign out"
          />
        </div>
      </div>
    </div >
  )
}

export default Settings
