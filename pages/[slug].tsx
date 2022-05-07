import { useEffect } from 'react'

import {
  GetServerSideProps,
} from 'next'
//import { useRouter } from 'next/router'
//import useCodeSnippet from 'utils/useCodeSnippet'
import {
  supabaseServerClient,
} from '@supabase/supabase-auth-helpers/nextjs'
import Splitter, { SplitDirection } from '@devbookhq/splitter'

import type {
  CodeSnippet,
} from 'types'
import Title from 'components/typography/Title'
import CodeEditor from 'components/CodeEditor'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const slug = ctx.query.slug as string

  // Try to get a code snippet from the DB based on the slug.
  const { data, error } = await supabaseServerClient(ctx)
    .from<CodeSnippet>('code_snippets')
    .select('*')
    .eq('slug', slug)

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

  return {
    props: {
      codeSnippet: data[0],
    },
  }
}

interface Props {
  error?: string
  codeSnippet?: CodeSnippet
}

function CodeSnippet({
  error,
  codeSnippet: cs,
}: Props) {
  console.log({ codeSnippet: cs, error })

  //const router = useRouter()
  //const { slug } = router.query
  //const {
  //  codeSnippet: cs,
  //  error,
  //  isLoading,
  //} = useCodeSnippet({ slug: Array.isArray(slug) ? slug[0] : slug  })

  //useEffect(() => {
  //  console.log({ query: router.query })
  //}, [router.query])

  //useEffect(() => {
  //  if (!isLoading && !error && !cs) router
  //}, [cs, isLoading, error])


  //console.log({ cs, error, isLoading })

  // TODO: Error handling
  // TODO: Handling undefined code snippet

  return (
    <>
      {cs && (
        <div className="
          flex-1
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
              title={cs.title}
            />
          </div>


          <div className="
            flex-1
            flex
            flex-col
            rounded-lg
            border
            border-black-700
          ">
            <Splitter
              direction={SplitDirection.Vertical}
              classes={['flex']}
              initialSizes={[85, 15]}
            >
              <div className="
                flex-1
                relative
                overflow-hidden
                bg-black-800
                rounded-b-lg
              ">
                <CodeEditor
                  content={cs.code || ''}
                  className="
                    absolute
                    inset-0
                  "
                />
              </div>
              <div className="
                p-2
                font-mono
                text-sm
              ">
                output will go here
              </div>
            </Splitter>
          </div>
        </div>
      )}
    </>
  )
}

export default CodeSnippet
