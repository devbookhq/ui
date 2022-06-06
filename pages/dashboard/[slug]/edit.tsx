import {
  useState,
  useEffect,
  useCallback,
} from 'react'
import { useRouter } from 'next/router'
import {
  getUser,
  withPageAuth,
  supabaseServerClient,
  supabaseClient,
} from '@supabase/supabase-auth-helpers/nextjs'
import { CodeSnippetExecState } from '@devbookhq/sdk'
import { api } from '@devbookhq/sdk'

import {
  PublishedCodeSnippet,
  CodeEnvironment,
  CodeSnippet,
} from 'types'
import { showErrorNotif } from 'utils/notification'
import { tabs } from 'utils/newCodeSnippetTabs'
import {
  getPublishedCodeSnippet,
  upsertPublishedCodeSnippet,
  upsertCodeSnippet,
} from 'utils/supabaseClient'
import CSEditorContent from 'components/CSEditorContent'
import TitleLink from 'components/TitleLink'
import Title from 'components/typography/Title'
import Text from 'components/typography/Text'
import ButtonLink from 'components/ButtonLink'
import useSession from 'utils/useSession'
import ExecutionButton from 'components/ExecutionButton'
import CSEditorHeader from 'components/CSEditorHeader'
import useAPIKey from 'utils/useAPIKey'
import { SessionProvider } from 'utils/SessionContext'

const deployEditedEnvJob = api.path('/envs/{codeSnippetID}').method('patch').create({ api_key: true })

export const getServerSideProps = withPageAuth({
  redirectTo: '/signin',
  async getServerSideProps(ctx) {
    try {
      const { user } = await getUser(ctx)
      const { tab, slug }: { tab?: string, slug?: string } = ctx.query
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
      const { data: csData, error: csErr } = await supabaseServerClient(ctx)
        .from<CodeSnippet>('code_snippets')
        .select('*')
        .eq('id', id)
        // Check if the user is the owner of a code snippet.
        .eq('creator_id', user!.id)

      if (csErr) {
        return {
          props: {
            error: csErr.message,
          }
        }
      } else if (!csData.length) {
        return {
          notFound: true,
        }
      }

      const codeSnippet: CodeSnippet | undefined = csData && csData[0]
      const csSlug = codeSnippet ? `${codeSnippet.title}-${codeSnippet.id}` : undefined

      // Also retrieve the code snippet's environment.
      const { data: env, error: envErr } = await supabaseServerClient(ctx)
        .from<CodeEnvironment>('envs')
        .select('*')
        .eq('code_snippet_id', id)
        .single()
      if (envErr) {
        return {
          props: {
            error: envErr.message,
          }
        }
      } else if (!env) {
        return {
          props: {
            error: 'No environment for the code snippet found'
          }
        }
      }

      // Redirect user to the `?tab=code` if no valid tab query is present.
      if (
        // We fetch the code snippet based on the ID at the end of a slug.
        // User can change the prefix however they want but we fix it once the page loads.
        // Example:
        // Correct slug: /code-snippet-name-:someid
        // User goes to: /foobar-:someid
        (slug !== csSlug) ||
        (!tab || !Object.entries(tabs).find(([_, val]) => val.key === tab))
      ) {
        return {
          redirect: {
            destination: `/dashboard/${csSlug}/edit?tab=${tabs.code.key}`,
            permanent: false,
          },
          props: {
            codeSnippet,
            env,
          },
        }
      }

      return {
        props: {
          codeSnippet,
          env,
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
  env: CodeEnvironment
  error?: string
}

function CodeSnippetEditor({
  codeSnippet,
  env: initialEnv,
  error,
}: Props) {
  const router = useRouter()

  const { key: apiKey } = useAPIKey(codeSnippet.creator_id)

  const [env, setEnv] = useState<CodeEnvironment>(initialEnv)
  const session = useSession({
    codeSnippetID: env.state == 'Done' ? codeSnippet.id : undefined,
    persistentEdits: true,
    debug: true,
    apiKey,
  })

  const {
    csState,
    run,
    state,
    stop,
  } = session

  const [execState, setExecState] = useState<CodeSnippetExecState>(CodeSnippetExecState.Loading)
  const [code, setCode] = useState(codeSnippet.code || '')
  const [title, setTitle] = useState(codeSnippet.title)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isLoadingPublishedCS, setIsLoadingPublishedCS] = useState(true)
  const [publishedCS, setPublishedCS] = useState<PublishedCodeSnippet | null>(null)
  const currentTab = router.query.tab
  const slug = `${title}-${codeSnippet.id}`

  useEffect(function updateCodeSnippet() {
    supabaseClient
      .from<CodeEnvironment>(`envs:code_snippet_id=eq.${codeSnippet.id}`)
      .on('UPDATE', payload => {
        setEnv(payload.new)
      })
      .subscribe()
  }, [codeSnippet])


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

  useEffect(function getPublishedCS() {
    if (!codeSnippet) return
    getPublishedCodeSnippet(codeSnippet.id)
      .then(({ data, error }) => {
        if (error) {
          console.error(error)
          showErrorNotif(`Error: ${error.message}`)
        }
        if (data && data.length > 0) {
          setPublishedCS(data[0])
        }
        setIsLoadingPublishedCS(false)
      })
  }, [codeSnippet])

  const handleCodeChange = useCallback(async (c: string) => {
    setCode(c)

    const newCS = {
      ...codeSnippet,
      code: c,
    }
    await upsertCodeSnippet(newCS)
  }, [setCode, codeSnippet])

  const handleTitleChange = useCallback(async (t: string) => {
    setTitle(t)

    if (!t) return
    // Convert whitespace to '-', make it lowercase and append code snippet ID.
    const newCS = {
      ...codeSnippet,
      title: t,
      slug: `${t.replace(/\s+/g, '-').toLowerCase()}-${codeSnippet.id}`,
    }
    await upsertCodeSnippet(newCS)
  }, [setTitle, codeSnippet])

  function runCode() {
    setExecState(CodeSnippetExecState.Loading)
    run(code)
  }

  function stopCode() {
    setExecState(CodeSnippetExecState.Loading)
    stop()
  }

  async function publishCodeSnippet() {
    try {
      if (!codeSnippet) throw new Error('Cannot publish code snippet - code snippet is undefined')
      if (isPublishing) return
      setIsPublishing(true)

      const newPCS: PublishedCodeSnippet = {
        id: publishedCS?.id,
        published_at: publishedCS?.published_at,
        code_snippet_id: codeSnippet.id,
        title,
        code,
      }
      const p1 = deployEditedEnvJob({
        codeSnippetID: codeSnippet.id,
        api_key: apiKey,
      })
      const p2 = upsertPublishedCodeSnippet(newPCS)
      const [, pcs] = await Promise.all([p1, p2])
      setPublishedCS(pcs)
      alert(`Code snippet '${title}' published`)
    } catch (err: any) {
      showErrorNotif(`Error: ${err.message}`)
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <>
      {error && (
        <div className="
          flex
          flex-col
          items-center
          text-red
          space-y-16
          py-6
          w-full
          bg-transparent
          border
          border-black-700
          rounded-lg
        ">
          <Title
            title="Something went wrong"
            size={Title.size.T2}
          />
          <Text
            text={error}
          />
          <ButtonLink
            href="/dashboard"
            text="Go Home"
          />
        </div>
      )}
      {!error &&
        <SessionProvider session={session}>
          <div className="
          flex-1
          flex
          flex-col
          space-y-6
        ">
            <CSEditorHeader
              slug={slug}
              onPublishClick={publishCodeSnippet}
              isPublishing={isPublishing}
              isLoadingPublishedCS={isLoadingPublishedCS}
            />

            <div className="
            flex
            items-center
            space-x-2
          ">
              <ExecutionButton
                state={execState}
                onRunClick={runCode}
                onStopClick={stopCode}
              />

              {env.state !== 'Done' &&
                <Title
                  size={Title.size.T3}
                  rank={Title.rank.Secondary}
                  title='Building environment for a new code snippet...'
                />
              }
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
                {Object.values(tabs).map(val => (
                  <TitleLink
                    key={val.key}
                    href={{
                      pathname: '/dashboard/[slug]/edit',
                      query: {
                        slug,
                        tab: val.key,
                      },
                    }}
                    title={val.title}
                    icon={val.icon}
                    size={TitleLink.size.T3}
                    active={val.key === currentTab}
                    shallow
                  />
                ))}
              </div>
              <CSEditorContent
                code={code}
                title={title}
                onCodeChange={handleCodeChange}
                onTitleChange={handleTitleChange}
              />
              {/*
            <CSEditorSidebar
              codeSnippet={codeSnippet}
              latestCode={code}
              latestTitle={title}
            />
            */}
            </div>
          </div>
        </SessionProvider>
      }
    </>
  )
}

export default CodeSnippetEditor
