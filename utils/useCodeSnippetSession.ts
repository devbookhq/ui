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

export type SessionState = 'open' | 'closed'

export interface Opts {
  codeSnippetID?: string
  persistentEdits?: boolean
  debug?: boolean
}

function useCodeSnippetSession({
  /**
   * If the `codeSnippetID` is undefined the session will not be initialized.
   */
  codeSnippetID,
  /**
   * If enabled, the edits to a VM's filesystem will be saved for the next session.
   */
  persistentEdits,
  debug,
}: Opts) {
  const [sessionState, setSessionState] = useState<{
    session?: Session,
    openingPromise?: Promise<void>,
    state: SessionState,
  }>({ state: 'closed' })
  const [csState, setCSState] = useState<CodeSnippetExecState>(CodeSnippetExecState.Stopped)
  const [csOutput, setCSOutput] = useState<CodeSnippetOutput[]>([])

  useEffect(function initSession() {
    if (!codeSnippetID) return

    const newSession = new Session({
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

  return useMemo(() => ({
    stop,
    run,
    getHostname,
    csState,
    terminalManager: sessionState.session?.terminal,
    csOutput,
    state: sessionState.state,
  }), [
    stop,
    getHostname,
    run,
    sessionState.session?.terminal,
    csState,
    csOutput,
    sessionState.state,
  ])
}

export default useCodeSnippetSession
