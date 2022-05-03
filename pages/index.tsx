import { withAuthRequired } from '@supabase/supabase-auth-helpers/nextjs'

import { useUser } from 'utils/useUser'
import Title from 'components/typography/Title'
import Button from 'components/Button'
import CodeSnippetCard from 'components/CodeSnippetCard'

export const getServerSideProps = withAuthRequired({ redirectTo: '/signin' })
function Home() {
  const { codeSnippets } = useUser()

  return (
    <div className="
      flex
      flex-col
      space-y-16
    ">
      <Title>Code Snippets</Title>

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

          <Button
            text="New Code Snippet"
            onClick={() => {}}
          />
        </div>
      )
      : (
        <div className="
          flex
          flex-col
          items-center
          space-y-2

          md:flex-row
          md:flex-wrap
          md:space-y-0
          md:gap-2
        ">
          {codeSnippets.map(cs => (
            <>
            <CodeSnippetCard
              key={cs.id}
              codeSnippet={cs}
            />
            <CodeSnippetCard
              key={cs.id}
              codeSnippet={cs}
            />
            <CodeSnippetCard
              key={cs.id}
              codeSnippet={cs}
            />
            </>
          ))}
        </div>
      )}


    </div>
  )
}

export default Home
