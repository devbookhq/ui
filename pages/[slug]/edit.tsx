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
import { EnvVars } from '@devbookhq/sdk'

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
  updateCodeSnippet,
} from 'utils/supabaseClient'
import CSEditorContent from 'components/CSEditorContent'
import TitleLink from 'components/TitleLink'
import Title from 'components/typography/Title'
import Text from 'components/typography/Text'
import ButtonLink from 'components/ButtonLink'
import useSession from 'utils/useSession'
import ExecutionButton from 'components/ExecutionButton'
import CSEditorHeader from 'components/CSEditorHeader'
import { SharedSessionProvider } from 'utils/useSharedSession'
import useUserInfo from 'utils/useUserInfo'
import { updateEnv } from 'utils/api'

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
            destination: `/${csSlug}/edit?tab=${tabs.code.key}`,
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
  const [env, setEnv] = useState<CodeEnvironment>(initialEnv)
  const [code, setCode] = useState(codeSnippet.code || '')
  const [envVars, setEnvVars] = useState<EnvVars>(codeSnippet.env_vars || {})
  const [title, setTitle] = useState(codeSnippet.title)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isLoadingPublishedCS, setIsLoadingPublishedCS] = useState(true)
  const [publishedCS, setPublishedCS] = useState<PublishedCodeSnippet>()
  const [hostname, setHostname] = useState('')

  const router = useRouter()

  const { apiKey } = useUserInfo()
  const session = useSession({
    codeSnippetID: codeSnippet.id,
    persistentEdits: true,
    debug: true,
    apiKey,
    manualOpen: true,
  })

  const {
    csState,
    run,
    stop,
    open,
    ports,
    state,
    getHostname,
  } = session

  const currentTab = router.query.tab
  const slug = `${title}-${codeSnippet.id}`

  useEffect(function openSession() {
    if (env.state === 'Done') {
      open?.()
    }
  }, [
    open,
    env.state,
  ])

  useEffect(function obtainHostname() {
    if (state !== 'open') return
    getHostname().then(h => setHostname(h || ''))
  }, [state, getHostname])

  useEffect(function subscribeToEnv() {
    const sub = supabaseClient
      .from<CodeEnvironment>(`envs:code_snippet_id=eq.${codeSnippet.id}`)
      .on('UPDATE', payload => {
        setEnv(payload.new)
      })
      .subscribe()
    return () => {
      supabaseClient.removeSubscription(sub)
    }
  }, [codeSnippet])

  useEffect(function checkForError() {
    if (error) {
      showErrorNotif(`Error: ${error}`)
    }
  }, [error])

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
    if (!apiKey) throw new Error('API key is undefined')

    setCode(c)

    await updateCodeSnippet(apiKey, {
      id: codeSnippet.id,
      code: c,
    })
  }, [
    codeSnippet.id,
    apiKey,
  ])

  const handleEnvVarsChange = useCallback(async (e: EnvVars) => {
    if (!apiKey) throw new Error('API key is undefined')

    setEnvVars(e)

    await updateCodeSnippet(apiKey, {
      id: codeSnippet.id,
      env_vars: e,
    })
  }, [
    codeSnippet.id,
    apiKey,
  ])

  const handleTitleChange = useCallback(async (t: string) => {
    if (!apiKey) throw new Error('API key is undefined')
    if (!t) return

    setTitle(t)

    await updateCodeSnippet(apiKey, {
      id: codeSnippet.id,
      title: t,
    })
  }, [
    codeSnippet.id,
    apiKey,
  ])

  function runCode() {
    run(code, envVars)
  }

  function stopCode() {
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
        env_vars: envVars,
        title,
        code,
        template: codeSnippet.template,
      }
      const p1 = updateEnv({
        codeSnippetID: codeSnippet.id,
        api_key: apiKey,
      })
      const p2 = upsertPublishedCodeSnippet(newPCS)
      const [, pcs] = await Promise.all([p1, p2])
      setPublishedCS(pcs)
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
            href="/"
            text="Go Home"
          />
        </div>
      )}
      {!error &&
        <SharedSessionProvider session={session}>
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
              publishedCS={publishedCS}
            />
            <div className="
              flex
              items-center
              justify-start
              space-x-2
            ">
              {env.state !== 'Done' &&
                <Title
                  size={Title.size.T2}
                  rank={Title.rank.Secondary}
                  title='Rebuilding...'
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
              md:space-x-8
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
              <ExecutionButton
                state={csState}
                onRunClick={runCode}
                onStopClick={stopCode}
              />
                {Object.values(tabs).map(val => (
                  <TitleLink
                    key={val.key}
                    href={{
                      pathname: '/[slug]/edit',
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
                <div className="
                  pt-2
                  flex
                  flex-col
                  items-start
                  justify-start
                ">
                  <Title
                    size={Title.size.T2}
                    title="Open ports"
                  />
                  {hostname && ports.map(p => (
                    <a
                      className="
                        max-w-full
                        text-green-500
                        overflow-hidden
                        truncate
                        cursor-pointer
                        underline
                      "
                      rel="noreferrer"
                      target="_blank"
                      key={`${p.Ip}-${p.Port}`}
                      href={`https://${p.Port}-${hostname}`}
                    >
                      {`:${p.Port}`}
                    </a>
                  ))}
                </div>
              </div>
              <CSEditorContent
                code={code}
                title={title}
                envVars={envVars}
                language={codeSnippet.template}
                onEnvVarsChange={handleEnvVarsChange}
                onCodeChange={handleCodeChange}
                onTitleChange={handleTitleChange}
              />
            </div>
          </div>
        </SharedSessionProvider>
      }
    </>
  )
}

export default CodeSnippetEditor
