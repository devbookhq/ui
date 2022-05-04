import { withAuthRequired } from '@supabase/supabase-auth-helpers/nextjs'

import { useUser } from 'utils/useUser'
import Title from 'components/typography/Title'
import ButtonLink from 'components/ButtonLink'
import CodeSnippetCards from 'components/CodeSnippetCards'
import PlusIcon from 'components/icons/Plus'

export const getServerSideProps = withAuthRequired({ redirectTo: '/signin' })
function Home() {
  const { codeSnippets } = useUser()

  // TODO: Loading before `useUser` is ready and everything is loaded.

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
        <Title>Code Snippets</Title>
        <ButtonLink
          text="New Code Snippet"
          icon={<PlusIcon/>}
          href="/new"
        />
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
          <Title variant={Title.variant.T2}>Get Started</Title>

          <div/>

          <ButtonLink
            variant={ButtonLink.variant.Full}
            text="New Code Snippet"
            href="/new"
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
