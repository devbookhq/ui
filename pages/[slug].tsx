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

import type {
  CodeSnippet,
} from 'types'
import Title from 'components/typography/Title'
import Text from 'components/typography/Text'
import CodeEditor from 'components/CodeEditor'
import ExecutionButton, { ExecutionState } from 'components/ExecutionButton'
import useCodeSnippetSession from 'utils/useCodeSnippetSession'
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
    .from<CodeSnippet>('code_snippets')
    .select('*')
    .eq('id', id)


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

  // We fetch the code snippet based on the ID at the end of a slug.
  // User can change the prefix however they want but we fix it once the page loads.
  // Example:
  // Correct slug: /code-snippet-name-:someid
  // User goes to: /foobar-:someid
  if (slug !== codeSnippet.slug) {
    return {
      redirect: {
        destination: `/${codeSnippet.slug}`,
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
}

interface Props {
  error?: string
  codeSnippet?: CodeSnippet
}

function CodeSnippet({
  error,
  codeSnippet: cs,
}: Props) {
  const [sizes, setSizes] = useState<number[]>([85, 15])
  const [execState, setExecState] = useState<ExecutionState>(ExecutionState.Loading)

  // TODO: Handle error from the server side props.
  // TODO: Handling undefined code snippet.

  const {
    csOutput,
    csState,
    run,
    state,
    stop,
  } = useCodeSnippetSession(cs?.id)

  useEffect(function onCSStateChange() {
    if (csState === 'running') setExecState(ExecutionState.Running)
    else if (csState === 'stopped') setExecState(ExecutionState.Stopped)
  }, [csState])

  function runCode(code: string) {
    setExecState(ExecutionState.Loading)
    run(code)
  }

  function stopCode() {
    setExecState(ExecutionState.Loading)
    stop()
  }

  return (
    <>
      {cs && (
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
              title={cs.title}
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
              onClick={csState === 'running' ? stopCode : () => runCode(cs.code || '')}
              isDisabled={execState === ExecutionState.Loading}
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
                    content={cs.code || ''}
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
      )}
    </>
  )
}

export default CodeSnippet
