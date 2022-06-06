import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
import {
  Session,
  CodeSnippetExecState,
} from '@devbookhq/sdk'

export interface CodeSnippetOutput {
  type: 'stderr' | 'stdout'
  value: string
}

export interface DepsOut {
  line: string
  dep: string
}

export type SessionState = 'open' | 'closed'

export interface Opts {
  codeSnippetID?: string
  persistentEdits?: boolean
  debug?: boolean
  apiKey?: string
}

function useSession({
  /**
   * If the `codeSnippetID` is undefined the session will not be initialized.
   */
  codeSnippetID,
  /**
   * If enabled, the edits to a VM's filesystem will be saved for the next session.
   */
  persistentEdits,
  debug,
  apiKey,
}: Opts) {
  const [sessionState, setSessionState] = useState<{
    session?: Session,
    openingPromise?: Promise<void>,
    state: SessionState,
  }>({ state: 'closed' })
  const [csState, setCSState] = useState<CodeSnippetExecState>(CodeSnippetExecState.Stopped)
  const [csOutput, setCSOutput] = useState<CodeSnippetOutput[]>([])

  const [depsStdout, setDepsStdout] = useState<DepsOut[]>([])
  const [depstStderr, setDepsStderr] = useState<DepsOut[]>([])

  useEffect(function initSession() {
    if (!codeSnippetID) return
    if (!apiKey) return

    const newSession = new Session({
      apiKey,
      id: codeSnippetID,
      codeSnippet: {
        onStateChange(state) {
          setCSState(state)
        },
        onStderr(stderr) {
          setCSOutput(o => [...o, { type: 'stderr', value: stderr }])
        },
        onStdout(stdout) {
          setCSOutput(o => [...o, { type: 'stdout', value: stdout }])
        },
        onDepsStdout(params) {
          console.log('Deps Stdout', params)
        },
        onDepsStderr(params) {
          console.log('Deps Stderr', params)
        },
      },
      onClose() {
        setSessionState(s => s.session === newSession ? { ...s, state: 'closed' } : s)
      },
      editEnabled: persistentEdits,
      debug,
    })

    const openingPromise = newSession.open()
      .then(() => {
        setSessionState(s => s.session === newSession ? { ...s, state: 'open' } : s)
      })
      .catch(err => {
        console.error(err)
      })

    setSessionState({ session: newSession, state: 'closed', openingPromise })

    return () => {
      newSession.close()
    }
  },
    // We are excluding handlers from dep array,
    // because they may have been defined as inlined functions and their identity would change with every rerender.
    [
      codeSnippetID,
      persistentEdits,
      debug,
      apiKey,
    ])

  const stop = useCallback(async () => {
    if (!sessionState.session) return
    await sessionState.openingPromise
    await sessionState.session.codeSnippet?.stop()
  }, [sessionState])

  const run = useCallback(async (code: string) => {
    if (!sessionState.session) return
    await sessionState.openingPromise
    await sessionState.session.codeSnippet?.run(code)
  }, [sessionState])

  const getHostname = useCallback(async (port?: number) => {
    if (!sessionState.session) return
    await sessionState.openingPromise
    return sessionState.session.getHostname(port)
  }, [sessionState])

  const installDep = useCallback(async (dep: string) => {
    if (!sessionState.session) return
    await sessionState.openingPromise
    await sessionState.session.codeSnippet?.installDep(dep)
  }, [sessionState])

  return useMemo(() => ({
    stop,
    run,
    getHostname,
    installDep,
    csState,
    terminalManager: sessionState.session?.terminal,
    csOutput,
    state: sessionState.state,
  }), [
    stop,
    getHostname,
    run,
    installDep,
    sessionState.session?.terminal,
    csState,
    csOutput,
    sessionState.state,
  ])
}

export default useSession
