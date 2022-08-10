import {
  useState,
  useEffect,
} from 'react'
import { useRouter } from 'next/router'
import { withPageAuth } from '@supabase/supabase-auth-helpers/nextjs'
import { PlusIcon } from '@radix-ui/react-icons'

import type { Template } from 'types'
import { createCodeSnippet } from 'utils/supabaseClient'
import { showErrorNotif } from 'utils/notification'
import Title from 'components/typography/Title'
import Button from 'components/Button'
import CodeSnippetCards from 'components/CodeSnippetCards'
import SpinnerIcon from 'components/icons/Spinner'
import NewCodeSnippetModal from 'components/NewCodeSnippetModal'
import useCodeSnippets from 'utils/useCodeSnippets'
import useUserInfo from 'utils/useUserInfo'

export const getServerSideProps = withPageAuth({ redirectTo: '/signin' })

function Dashboard() {
  const router = useRouter()
  const [isLoadingNewSnippet, setIsLoadingNewSnippet] = useState(false)
  const [isCSModalOpened, setIsCSModalOpened] = useState(false)

  const { apiKey, user } = useUserInfo()

  const {
    codeSnippets,
    isLoading,
    error: csError,
  } = useCodeSnippets(user?.id || '')

  function closeCSModal() {
    setIsCSModalOpened(false)
  }

  function openCSModal() {
    setIsCSModalOpened(true)
  }

  async function handleCreateCodeSnippetClick({ template, title }: {
    template: Template,
    title: string,
  }) {
    if (!apiKey) throw new Error('API key is undefined')
    setIsLoadingNewSnippet(true)
    createCodeSnippet(apiKey, { title }, { template: template.value, deps: [] })
      .then((data: any) => {
        if (data.statusCode === 500 && data.message) {
          throw new Error(data.message)
        }
        const slug = `${data.title}-${data.id}`

        router.push({
          pathname: '/[slug]/edit',
          query: {
            tab: 'code',
            slug: slug,
          },
        })
      })
      .catch(err => {
        showErrorNotif(`Error: ${err.message}`)
        setIsLoadingNewSnippet(false)
      })
  }

  useEffect(function checkCSError() {
    if (!csError) return
    showErrorNotif(`Error: ${csError}`)
  }, [csError])

  return (
    <>
      <NewCodeSnippetModal
        isOpen={isCSModalOpened}
        isLoading={isLoadingNewSnippet}
        onClose={closeCSModal}
        onCreateCodeSnippetClick={handleCreateCodeSnippetClick}
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

          {codeSnippets.length > 0 && (
            <Button
              text="New code snippet"
              icon={isLoadingNewSnippet ? <SpinnerIcon /> : <PlusIcon />}
              onClick={openCSModal}
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

        {!isLoading && codeSnippets.length > 0 && (
          <CodeSnippetCards
            codeSnippets={codeSnippets}
          />
        )}

        {!isLoading && codeSnippets.length === 0 && (
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
              text="New code snippet"
              onClick={openCSModal}
              isDisabled={isLoadingNewSnippet}
            />
          </div>
        )}
      </div>
    </>
  )
}

export default Dashboard
