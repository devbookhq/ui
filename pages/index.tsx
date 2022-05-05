import { useState } from 'react'
import { useRouter } from 'next/router'
import { withAuthRequired } from '@supabase/supabase-auth-helpers/nextjs'
import useSWR from 'swr'
import { toast } from 'react-toastify'

import { useUser } from 'utils/useUser'
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
    await new Promise((resolve) => setTimeout(() => resolve(), 1000))
    try {
      fetch('/api/code', {
        method: 'PUT',
      })
      .then(response => response.json())
      .then(data => {
        console.log({ data })
        // TODO: Push to /c/slug or ideally /slug
      })
    } catch(err: any) {
      toast.error(`Error: ${err.message}`, {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
      })
      setIsLoading(false)
    }
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
