import { supabaseClient, withPageAuth } from '@supabase/supabase-auth-helpers/nextjs'
import { useUser } from '@supabase/supabase-auth-helpers/react'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import AppList from 'components/AppList'
import Button from 'components/Button'
import Feedback from 'components/Feedback'
import NewAppModal from 'components/NewAppModal'
import SpinnerIcon from 'components/icons/Spinner'
import Title from 'components/typography/Title'

import { getSlug } from 'utils/app'
import { showErrorNotif } from 'utils/notification'
import { createApp } from 'utils/queries/queries'

import useApps from 'hooks/useApps'

import { defaultRootState } from '../core/BuilderProvider/models/RootStoreProvider'

export const getServerSideProps = withPageAuth({
  redirectTo: '/signin',
})

function Dashboard() {
  const router = useRouter()
  const [isLoadingNewSnippet, setIsLoadingNewSnippet] = useState(false)
  const [isModalOpened, setIsModalOpened] = useState(false)

  const { user } = useUser()

  const { apps, isLoading, error: csError } = useApps(user?.id || '')

  function closeModal() {
    setIsModalOpened(false)
  }

  function openModal() {
    setIsModalOpened(true)
  }

  async function handleCreateApp({ title, id }: { title: string; id: string }) {
    if (!user) throw new Error('User is undefined')
    setIsLoadingNewSnippet(true)

    createApp(supabaseClient, {
      title,
      id,
      creator_id: user.id,
      state: defaultRootState,
    })
      .then((data: any) => {
        if (data.statusCode === 500 && data.message) {
          throw new Error(data.message)
        }

        const slug = getSlug(data.id, data.title)
        router.push({
          pathname: '/[slug]/edit',
          query: {
            slug,
          },
        })
      })
      .catch(err => {
        showErrorNotif(`Error: ${err.message}`)
        setIsLoadingNewSnippet(false)
        closeModal()
      })
  }

  useEffect(
    function checkAppError() {
      if (!csError) return
      showErrorNotif(`Error: ${csError}`)
    },
    [csError],
  )

  return (
    <>
      <div className="fixed left-4 bottom-4">
        <Feedback />
      </div>
      <NewAppModal
        isLoading={isLoadingNewSnippet}
        isOpen={isModalOpened}
        onClose={closeModal}
        onCreate={handleCreateApp}
      />
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
          title="Apps"
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
          items-center
          space-y-2

          sm:flex-row
          sm:items-center
          sm:justify-between
          sm:space-y-0
        "
          >
            {apps.length > 0 && (
              <Button
                icon={isLoadingNewSnippet ? <SpinnerIcon /> : <Plus />}
                isDisabled={isLoadingNewSnippet}
                text="New app"
                variant={Button.variant.Full}
                onClick={openModal}
              />
            )}
          </div>

          {isLoading && (
            <div
              className="
            flex
            flex-1
            items-center
            justify-center
          "
            >
              <SpinnerIcon />
            </div>
          )}

          {!isLoading && apps.length > 0 && <AppList apps={apps} />}

          {!isLoading && apps.length === 0 && (
            <div
              className="
            flex
            w-full
            flex-col
            items-center
            space-y-16
            rounded
            border
            border-gray-200
            bg-transparent
            py-6
          "
            >
              <Title
                size={Title.size.T2}
                title="Get Started"
              />

              <div />

              <Button
                icon={isLoadingNewSnippet ? <SpinnerIcon /> : null}
                isDisabled={isLoadingNewSnippet}
                text="New app"
                variant={Button.variant.Full}
                onClick={openModal}
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Dashboard
