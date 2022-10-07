import {
  useState,
  useEffect,
} from 'react'
import { useRouter } from 'next/router'
import { supabaseClient, withPageAuth } from '@supabase/supabase-auth-helpers/nextjs'
import { PlusIcon } from '@radix-ui/react-icons'

import { showErrorNotif } from 'utils/notification'
import Title from 'components/typography/Title'
import Button from 'components/Button'
import CodeSnippetCards from 'components/CodeSnippetCards'
import SpinnerIcon from 'components/icons/Spinner'
import NewCodeSnippetModal from 'components/NewCodeSnippetModal'
import useApps from 'utils/useApps'
import useUserInfo from 'utils/useUserInfo'
import { createApp } from 'utils/queries'

export const getServerSideProps = withPageAuth({ redirectTo: '/signin' })

function Dashboard() {
  const router = useRouter()
  const [isLoadingNewSnippet, setIsLoadingNewSnippet] = useState(false)
  const [isModalOpened, setIsModalOpened] = useState(false)

  const { apiKey, user } = useUserInfo()

  const {
    apps,
    isLoading,
    error: csError,
  } = useApps(user?.id || '')

  function closeModal() {
    setIsModalOpened(false)
  }

  function openModal() {
    setIsModalOpened(true)
  }

  async function handleCreateApp({ title }: {
    title: string,
  }) {
    if (!apiKey) throw new Error('API key is undefined')
    setIsLoadingNewSnippet(true)
    createApp(supabaseClient, { title, serialized: {} })
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

  useEffect(function checkAppError() {
    if (!csError) return
    showErrorNotif(`Error: ${csError}`)
  }, [csError])

  return (
    <>
      <NewCodeSnippetModal
        isOpen={isModalOpened}
        isLoading={isLoadingNewSnippet}
        onClose={closeModal}
        onCreateCodeSnippetClick={handleCreateApp}
      />
      <div className="
        flex-1
        flex
        flex-col
        space-y-6
      ">
        <div className="
          flex
          flex-col
          items-center
          space-y-2

          sm:flex-row
          sm:justify-between
          sm:items-center
          sm:space-y-0
        ">
          <Title
            title="Code Snippets"
          />

          {apps.length > 0 && (
            <Button
              text="New app"
              icon={isLoadingNewSnippet ? <SpinnerIcon /> : <PlusIcon />}
              onClick={openModal}
              isDisabled={isLoadingNewSnippet}
            />
          )}
        </div>

        {isLoading && (
          <div className="
            flex-1
            flex
            items-center
            justify-center
          ">
            <SpinnerIcon />
          </div>
        )}

        {!isLoading && apps.length > 0 && (
          <CodeSnippetCards
            codeSnippets={apps}
          />
        )}

        {!isLoading && apps.length === 0 && (
          <div className="
            flex
            flex-col
            items-center
            space-y-16

            py-6

            w-full
            bg-transparent
            border
            border-black-700
            rounded-lg
          ">
            <Title
              title="Get Started"
              size={Title.size.T2}
            />

            <div />

            <Button
              variant={Button.variant.Full}
              icon={isLoadingNewSnippet ? <SpinnerIcon /> : null}
              text="New app"
              onClick={openModal}
              isDisabled={isLoadingNewSnippet}
            />
          </div>
        )}
      </div>
    </>
  )
}

export default Dashboard