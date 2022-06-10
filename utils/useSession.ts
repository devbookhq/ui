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

export type SessionState = 'open' | 'closed'

export interface Opts {
  codeSnippetID?: string
  persistentEdits?: boolean
  debug?: boolean
  apiKey?: string
  manualOpen?: boolean
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
  manualOpen = false,
}: Opts) {
  const [sessionState, setSessionState] = useState<{
    session?: Session,
    state: SessionState,
    id?: string,
    open?: () => Promise<void>,
  }>({ state: 'closed' })

  const [csState, setCSState] = useState<CodeSnippetExecState>(CodeSnippetExecState.Loading)
  const [csOutput, setCSOutput] = useState<OutResponse[]>([])

  const [depsOutput, setDepsOutput] = useState<DepOutResponse[]>([])
  const [deps, setDeps] = useState<string[]>()

  useEffect(function initSession() {
    if (!codeSnippetID) return
    if (persistentEdits && !apiKey) return

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

    const open = async () => {
      try {
        await newSession.open()
        setSessionState(s => s.session === newSession ? { ...s, state: 'open' } : s)
      } catch (e) {
      }
    }

    if (manualOpen) {
      setSessionState({ session: newSession, state: 'closed', id: codeSnippetID, open })
    } else {
      setSessionState({ session: newSession, state: 'closed', id: codeSnippetID })
      open()
    }

    return () => {
      newSession.close()
    }
  },
    [
      codeSnippetID,
      persistentEdits,
      debug,
      apiKey,
      manualOpen,
    ])

  const stop = useCallback(async () => {
    if (sessionState.state !== 'open') return
    return sessionState.session?.codeSnippet?.stop()
  }, [sessionState])

  const run = useCallback(async (code: string) => {
    if (sessionState.state !== 'open') return
    setCSOutput([])
    return sessionState.session?.codeSnippet?.run(code)
  }, [sessionState])

  const getHostname = useCallback(async (port?: number) => {
    if (sessionState.state !== 'open') return
    return sessionState.session?.getHostname(port)
  }, [sessionState])

  const installDep = useCallback(async (dep: string) => {
    if (sessionState.state !== 'open') return
    return sessionState.session?.codeSnippet?.installDep(dep)
  }, [sessionState])

  const uninstallDep = useCallback(async (dep: string) => {
    if (sessionState.state !== 'open') return
    return sessionState.session?.codeSnippet?.uninstallDep(dep)
  }, [sessionState])

  const listDeps = useCallback(async () => {
    if (sessionState.state !== 'open') return
    return sessionState.session?.codeSnippet?.listDeps()
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
    open: sessionState.open,
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
    sessionState.open,
    depsOutput,
    sessionState.state,
    deps,
  ])
}

export default useSession
