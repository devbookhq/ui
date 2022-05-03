import { withAuthRequired } from '@supabase/supabase-auth-helpers/nextjs'

import { useUser } from 'utils/useUser'
import Title from 'components/typography/Title'
import ButtonLink from 'components/ButtonLink'
import CodeSnippetCards from 'components/CodeSnippetCards'

export const getServerSideProps = withAuthRequired({ redirectTo: '/signin' })
function Home() {
  const { codeSnippets } = useUser()

  // TODO: Loading before `useUser` is ready and everything is loaded.

  return (
    <div className="
      flex
      flex-col
      space-y-16
    ">
      <div className="
        flex
        justify-between
        items-center
      ">
        <Title>Code Snippets</Title>
        <ButtonLink
          text="New Code Snippet"
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
          border-black-500
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
