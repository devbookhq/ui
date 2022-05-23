import {
  useState,
  useEffect,
} from 'react'
import { useRouter } from 'next/router'
import { withAuthRequired } from '@supabase/supabase-auth-helpers/nextjs'

import type { Template } from 'types'
import { useUser } from 'utils/useUser'
import { showErrorNotif } from 'utils/notification'
import Title from 'components/typography/Title'
import Button from 'components/Button'
import CodeSnippetCards from 'components/CodeSnippetCards'
import PlusIcon from 'components/icons/Plus'
import SpinnerIcon from 'components/icons/Spinner'
import NewCodeSnippetModal from 'components/NewCodeSnippetModal'
import useCodeSnippets from 'utils/useCodeSnippets'

export const getServerSideProps = withAuthRequired({ redirectTo: '/signin' })
function Dashboard() {
  const router = useRouter()
  const { user } = useUser()
  const [isLoadingNewSnippet, setIsLoadingNewSnippet] = useState(false)
  const [isCSModalOpened, setIsCSModalOpened] = useState(false)

  const {
    codeSnippets,
    isLoading,
    error: csError,
    reload: reloadCS,
  } = useCodeSnippets(user?.id || '')

  function closeCSModal() {
    setIsCSModalOpened(false)
  }

  function openCSModal() {
    setIsCSModalOpened(true)
  }

  async function createNewCodeSnippet({ template, title }: {
    template: Template,
    title: string,
  }) {
    // TODO: Template
    // TODO: Code snippet takes a template
    setIsLoadingNewSnippet(true)
    fetch('/api/code', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ template, title }),
    })
    .then(response => response.json())
    .then((data: any) => {
      if (data.statusCode === 500 && data.message) {
        throw new Error(data.message)
      }
      router.push(`/dashboard/${encodeURIComponent(data.slug)}/edit?tab=code`)
    })
    .catch(err => {
      showErrorNotif(`Error: ${err.message}`)
      setIsLoadingNewSnippet(false)
    })
  }

  function handleCodeSnippetDeletion() {
    reloadCS()
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
        onCreateCodeSnippetClick={createNewCodeSnippet}
      />
      <div className="
        flex-1
        flex
        flex-col
        space-y-6
        px-2
      ">
        <div className="
          flex
          flex-col
          space-y-2
          min-h-[48px]

          sm:flex-row
          sm:justify-between
          sm:items-center
        ">
          <Title
            title="Code Snippets"
          />

          {codeSnippets.length > 0 && (
            <Button
              text="New Code Snippet"
              icon={isLoadingNewSnippet ? <SpinnerIcon/> : <PlusIcon/>}
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
            <SpinnerIcon/>
          </div>
        )}

        {!isLoading && codeSnippets.length > 0 && (
          <CodeSnippetCards
            codeSnippets={codeSnippets}
            onCodeSnippetDeletion={handleCodeSnippetDeletion}
          />
        )}

        {!isLoading && !codeSnippets.length &&(
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

            <div/>

            <Button
              variant={Button.variant.Full}
              icon={isLoadingNewSnippet ? <SpinnerIcon/> : null}
              text="New Code Snippet"
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
