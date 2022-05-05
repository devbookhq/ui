import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import {
  getUser,
  withAuthRequired,
  supabaseServerClient,
} from '@supabase/supabase-auth-helpers/nextjs'

import type { CodeSnippet } from 'types'
import { tabs, Tab } from 'utils/newCodeSnippetTabs'
import NewCodeSnippetContent from 'components/NewCodeSnippetContent'
import TitleLink from 'components/TitleLink'
import Title from 'components/typography/Title'
import Button from 'components/Button'


export const getServerSideProps = withAuthRequired({
  redirectTo: '/signin',
  async getServerSideProps(ctx) {
    try {
      const { user } = await getUser(ctx)
      const { tab, slug }: { tab?: string, slug?: string } = ctx.query
      console.log({ tab, slug })

      // Try to get a code snippet from the DB based on the slug.
      const { data, error } = await supabaseServerClient(ctx)
        .from<CodeSnippet>('code_snippets')
        .select('*')
        .eq('slug', slug)
        // Check if the user is the owner of a code snippet.
        .eq('creator_id', user!.id)

      if (error) {
        return {
          props: {
            error: error.message,
          }
        }
      } else if (!data.length) {
        return {
          notFound: true,
        }
      }

      const codeSnippet = data[0]

      // Redirect user to the `?tab=code` if no valid tab query is present.
      if (!tab || !Object.entries(tabs).find(([key, val]) => val.key === tab)) {
        return {
          redirect: {
            destination: `/${slug}/edit?tab=${tabs.code.key}`,
            permanent: false,
          },
          props: {
            codeSnippet,
          },
        }
      }

      return {
        props: {
          codeSnippet,
        },
      }
    } catch (err: any) {
      return {
        props: {
          error: err.message,
        }
      }
    }
  }
})

interface Props {
  codeSnippet: CodeSnippet
  error?: string
}

function CodeSnippetEditor({ codeSnippet, error }: Props) {
  // TODO: if (error)

  console.log({ codeSnippet, error })

  const [code, setCode] = useState('')
  const router = useRouter()
  const slug = router.query.slug || []

  const currentTab = router.query.tab
  return (
    <>
      {/* Fake breadcrumbs */}
      <div className="
        flex-1
        flex
        flex-col
        space-y-6
      ">
        <div className="
          flex
          items-center
          space-x-2
          min-h-[48px]
        ">
           <TitleLink
             href="/"
             title="Code Snippets"
           />
           <Title title="/"/>
           <Title title="Edit"/>
        </div>

        <div className="
          flex-1
          flex
          flex-col
          space-y-4
          md:flex-row
          md:space-y-0
          md:space-x-4
        ">
          <div className="
            flex
            flex-row
            items-center
            justify-start
            space-x-4
            md:flex-col
            md:items-start
            md:space-x-0
            md:space-y-4
          ">
            {Object.entries(tabs).map(([key, val]) => (
              <TitleLink
                key={val.key}
                href={`/${codeSnippet.slug}/edit?tab=${val.key}`}
                title={val.title}
                icon={val.icon}
                size={TitleLink.size.T3}
                active={val.key === currentTab}
                shallow
              />
            ))}
          </div>

          <NewCodeSnippetContent
            code={code}
            onContentChange={setCode}
          />
        </div>
      </div>
    </>
  )
}

export default CodeSnippetEditor
