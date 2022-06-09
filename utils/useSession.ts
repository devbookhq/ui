import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
import {
  Session,
  CodeSnippetExecState,
  OutResponse,
  DepOutResponse,
} from '@devbookhq/sdk'

export type SessionState = 'none' | 'open' | 'closed'

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
    id?: string,
  }>({ state: 'none' })
  const [csState, setCSState] = useState<CodeSnippetExecState>(CodeSnippetExecState.Loading)
  const [csOutput, setCSOutput] = useState<OutResponse[]>([])

  const [depsOutput, setDepsOutput] = useState<DepOutResponse[]>([])
  const [deps, setDeps] = useState<string[]>()

  const shouldInitializeCodeSnippet =
    sessionState.state === 'none'
    && codeSnippetID !== undefined
    && sessionState.id !== codeSnippetID

  useEffect(function initSession() {
    if (!shouldInitializeCodeSnippet) return
    if (!codeSnippetID) return
    if (!apiKey && persistentEdits) return

    const newSession = new Session({
      apiKey,
      id: codeSnippetID,
      codeSnippet: {
        onStateChange(state) {
          setCSState(state)
        },
        onStderr(stderr) {
          setCSOutput(o => [...o, stderr])
        },
        onStdout(stdout) {
          setCSOutput(o => [...o, stdout])
        },
        onDepsStdout(stdout) {
          setDepsOutput(o => [...o, stdout])
        },
        onDepsStderr(stderr) {
          setDepsOutput(o => [...o, stderr])
        },
        onDepsChange(deps) {
          setDeps(deps)
        }
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

    setSessionState({ session: newSession, state: 'closed', openingPromise, id: codeSnippetID })

    return () => {
      setSessionState(s => s.session === newSession ? { state: 'none' } : s)
      newSession.close()
    }
  },
    // The codeSnippetID is intentionally missing - we instead use 'shouldInitializeCodeSnippet' to trigger the useEffect at the right time
    [
      shouldInitializeCodeSnippet,
      persistentEdits,
      debug,
      apiKey,
    ])

  const stop = useCallback(async () => {
    if (!sessionState.session) return
    await sessionState.openingPromise
    return sessionState.session.codeSnippet?.stop()
  }, [sessionState])

  const run = useCallback(async (code: string) => {
    if (!sessionState.session) return
    await sessionState.openingPromise
    setCSOutput([])
    return sessionState.session.codeSnippet?.run(code)
  }, [sessionState])

  const getHostname = useCallback(async (port?: number) => {
    if (!sessionState.session) return
    await sessionState.openingPromise
    return sessionState.session.getHostname(port)
  }, [sessionState])

  const installDep = useCallback(async (dep: string) => {
    if (!sessionState.session) return
    await sessionState.openingPromise
    return sessionState.session.codeSnippet?.installDep(dep)
  }, [sessionState])

  const uninstallDep = useCallback(async (dep: string) => {
    if (!sessionState.session) return
    await sessionState.openingPromise
    return sessionState.session.codeSnippet?.uninstallDep(dep)
  }, [sessionState])

  const listDeps = useCallback(async () => {
    if (!sessionState.session) return
    await sessionState.openingPromise
    return sessionState.session.codeSnippet?.listDeps()
  }, [sessionState])

  return useMemo(() => ({
    stop,
    run,
    getHostname,
    installDep,
    listDeps,
    uninstallDep,
    csState,
    terminalManager: sessionState.session?.terminal,
    csOutput,
    depsOutput,
    state: sessionState.state,
    deps,
  }), [
    stop,
    getHostname,
    run,
    installDep,
    uninstallDep,
    listDeps,
    sessionState.session?.terminal,
    csState,
    csOutput,
    depsOutput,
    sessionState.state,
    deps,
  ])
}

export default useSession
