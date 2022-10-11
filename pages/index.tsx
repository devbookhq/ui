import { PlusIcon } from '@radix-ui/react-icons'
import { supabaseClient, withPageAuth } from '@supabase/supabase-auth-helpers/nextjs'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import AppCards from 'components/AppCards'
import Button from 'components/Button'
import NewAppModal from 'components/NewAppModal'
import SpinnerIcon from 'components/icons/Spinner'
import Title from 'components/typography/Title'

import { showErrorNotif } from 'utils/notification'
import { createApp } from 'utils/queries/queries'
import useApps from 'utils/useApps'
import useUserInfo from 'utils/useUserInfo'

export const getServerSideProps = withPageAuth({
  redirectTo: '/signin',
})

function Dashboard() {
  const router = useRouter()
  const [isLoadingNewSnippet, setIsLoadingNewSnippet] = useState(false)
  const [isModalOpened, setIsModalOpened] = useState(false)

  const { apiKey, user } = useUserInfo()

  const { apps, isLoading, error: csError } = useApps(user?.id || '')

  function closeModal() {
    setIsModalOpened(false)
  }

  function openModal() {
    setIsModalOpened(true)
  }

  async function handleCreateApp({ title, id }: { title: string; id: string }) {
    if (!apiKey) throw new Error('API key is undefined')
    if (!user) throw new Error('User is undefined')

    setIsLoadingNewSnippet(true)
    createApp(supabaseClient, {
      title,
      id,
      creator_id: user.id,
      serialized: {},
    })
      .then((data: any) => {
        if (data.statusCode === 500 && data.message) {
          throw new Error(data.message)
        }
        const slug = `${data.title}-${data.id}`

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
        flex-col
        space-y-6
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
          <Title title="Apps" />

          {apps.length > 0 && (
            <Button
              icon={isLoadingNewSnippet ? <SpinnerIcon /> : <PlusIcon />}
              isDisabled={isLoadingNewSnippet}
              text="New app"
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

        {!isLoading && apps.length > 0 && <AppCards apps={apps} />}

        {!isLoading && apps.length === 0 && (
          <div
            className="
            flex
            w-full
            flex-col
            items-center

            space-y-16

            rounded-lg
            border
            border-black-700
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
    </>
  )
}

export default Dashboard
