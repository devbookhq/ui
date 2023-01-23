import { withPageAuth } from '@supabase/supabase-auth-helpers/nextjs'
import { useUser } from '@supabase/supabase-auth-helpers/react'
import { useEffect } from 'react'

import Feedback from 'components/Feedback'
import SpinnerIcon from 'components/icons/Spinner'
import Text from 'components/typography/Text'
import ItemList from 'components/ItemList'
import { showErrorNotif } from 'utils/notification'

import useEnvs from 'hooks/useEnvs'
import { Box, Boxes } from 'lucide-react'

export const getServerSideProps = withPageAuth({
  redirectTo: '/signin',
})

function Envs() {
  const { user } = useUser()
  const { envs, isLoading, error: envError } = useEnvs(user?.id || '')

  useEffect(
    function checkAppError() {
      if (!envError) return
      showErrorNotif(`Error retrieving apps: ${envError}`)
    },
    [envError],
  )

  return (
    <>
      <div className="fixed left-4 bottom-4">
        <Feedback />
      </div>
      <div
        className="
      flex
      flex-1
      flex-col
      space-x-0
      overflow-hidden
      p-12
      md:flex-row
      md:space-y-0
      md:p-16
    "
      >
        <div className="flex items-start justify-start">
          <div className="items-center flex space-x-2">
            <Boxes size="32px" strokeWidth="1.1" />
            <Text
              size={Text.size.S1}
              text="Envs"
            />
          </div>
        </div>

        <div
          className="
        flex
        flex-1
        flex-col
        items-stretch
        space-y-4
        overflow-hidden
        "
        >
          {isLoading && (
            <div
              className="
            flex
            flex-1
            items-center
            justify-center
          "
            >
              <SpinnerIcon className="text-slate-400" />
            </div>
          )}

          {!isLoading && envs.length > 0 && (
            <div className="flex flex-1 justify-center overflow-hidden">
              <ItemList
                items={envs.map(e => ({
                  ...e,
                  path: '/envs/[slug]/edit',
                  type: 'Env',
                  icon: <Box size="22px" strokeWidth="1.5" />,
                }))}
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Envs
