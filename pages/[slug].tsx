import {
  useState,
  useEffect,
} from 'react'
import {
  GetServerSideProps,
} from 'next'
import {
  supabaseServerClient,
} from '@supabase/supabase-auth-helpers/nextjs'
import Splitter, { SplitDirection } from '@devbookhq/splitter'
import { CodeSnippetExecState } from '@devbookhq/sdk'

import type {
  PublishedCodeSnippet,
} from 'types'
import { showErrorNotif } from 'utils/notification'
import Title from 'components/typography/Title'
import CodeEditor from 'components/CodeEditor'
import ExecutionButton from 'components/ExecutionButton'
import useSession from 'utils/useSession'
import Output from 'components/Output'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const slug = ctx.query.slug as string | undefined
  if (!slug) {
    return {
      notFound: true,
    }
  }
  const splits = slug.split('-')
  const id = splits[splits.length - 1]
  if (!id) {
    return {
      notFound: true,
    }
  }

  // Try to get a code snippet from the DB based on a ID in the slug.
  const { data, error } = await supabaseServerClient(ctx)
    .from<PublishedCodeSnippet>('published_code_snippets')
    .select('*')
    .eq('code_snippet_id', id)


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
  const publishedCS = data[0]

  // We fetch the code snippet based on the ID at the end of a slug.
  // User can change the prefix however they want but we fix it once the page loads.
  // Example:
  // Correct slug: /code-snippet-name-:someid
  // User goes to: /foobar-:someid
  const csSlug = `${publishedCS.title}-${publishedCS.code_snippet_id}`
  if (slug !== csSlug) {
    return {
      redirect: {
        destination: `/${csSlug}`,
      },
      props: {
        codeSnippet: publishedCS,
      },
    }
  }

  return {
    props: {
      codeSnippet: publishedCS,
    },
  }
}

interface Props {
  error?: string
  publishedCodeSnippet: PublishedCodeSnippet
}

function CodeSnippet({
  error,
  publishedCodeSnippet: pcs,
}: Props) {
  const [sizes, setSizes] = useState<number[]>([85, 15])
  const [execState, setExecState] = useState<CodeSnippetExecState>(CodeSnippetExecState.Loading)

  const {
    csOutput,
    csState,
    run,
    state,
    stop,
  } = useSession({
    codeSnippetID: pcs.id,
  })

  useEffect(function checkForError() {
    if (error) {
      showErrorNotif(`Error: ${error}`)
    }
  }, [error])

  useEffect(function onSessionStateChange() {
    setExecState(CodeSnippetExecState.Stopped)
  }, [state])

  useEffect(function onCSStateChange() {
    setExecState(csState)
  }, [csState])

  function runCode() {
    setExecState(CodeSnippetExecState.Loading)
    run(pcs.code)
  }

  function stopCode() {
    setExecState(CodeSnippetExecState.Loading)
    stop()
  }

  return (
    <div className="
      flex-1
      flex
      flex-col
      items-start
    ">
      <div className="
        flex
        flex-col
        items-start
        justify-start
        min-h-[48px]
        mb-6
      ">
        <Title
          title={pcs.title}
        />
      </div>

      <div className="
        w-full
        flex-1
        flex
        flex-col
        items-center
        justify-center
      ">
        <ExecutionButton
          className="mb-4"
          state={execState}
          onRunClick={runCode}
          onStopClick={stopCode}
        />

        <div className="
          w-full
          flex-1
          flex
          flex-col
          rounded-lg
          border
          border-black-700
        ">
          <Splitter
            direction={SplitDirection.Vertical}
            classes={['flex min-h-0', 'flex min-h-0']}
            initialSizes={sizes}
            onResizeFinished={(_, sizes) => setSizes(sizes)}
          >
            <div className="
              rounded-t-lg
              flex-1
              relative
              overflow-hidden
              bg-black-800
            ">
              <CodeEditor
                isReadOnly
                content={pcs.code}
                className="
                  absolute
                  inset-0
                "
              />
            </div>
            <Output
              output={csOutput}
            />
          </Splitter>
        </div>
      </div>
    </div>
  )
}

export default CodeSnippet
