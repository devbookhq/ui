import { useState } from 'react'
import { useRouter } from 'next/router'
import { withAuthRequired } from '@supabase/supabase-auth-helpers/nextjs'

import { useUser } from 'utils/useUser'
import { showErrorNotif } from 'utils/notification'
import Title from 'components/typography/Title'
import Button from 'components/Button'
import CodeSnippetCards from 'components/CodeSnippetCards'
import PlusIcon from 'components/icons/Plus'

export const getServerSideProps = withAuthRequired({ redirectTo: '/signin' })
function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { codeSnippets } = useUser()

  // TODO: Loading before `useUser` is ready and everything is loaded.

  async function createNewCodeSnippet() {
    setIsLoading(true)
    fetch('/api/code', {
      method: 'PUT',
    })
    .then(response => response.json())
    .then((data: any) => {
      if (data.statusCode === 500 && data.message) {
        throw new Error(data.message)
      }
      router.push(`/${data.slug}/edit?tab=code`)
    })
    .catch(err => {
      showErrorNotif(`Error: ${err.message}`)
      setIsLoading(false)
    })
  }

  return (
    <div className="
      flex
      flex-col
      space-y-6
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
            icon={<PlusIcon/>}
            onClick={createNewCodeSnippet}
          />
        )}
      </div>

      {!codeSnippets.length
      ? (
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
            text="New Code Snippet"
            onClick={createNewCodeSnippet}
          />
        </div>
      )
      : (
        <CodeSnippetCards
          codeSnippets={codeSnippets}
        />
      )}
    </div>
  )
}

export default Home
