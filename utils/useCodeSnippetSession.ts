import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
import {
  Session,
  CodeSnippetState,
  SessionHandlers,
} from '@devbookhq/sdk'

export interface CodeSnippetOutput {
  type: 'stderr' | 'stdout'
  value: string
}

function useCodeSnippetSession(
  /**
   * If the `codeSnippetID` is undefined the session will not be initialized.
   */
  codeSnippetID?: string,
  /**
   * Handlers are excluded from the dependency array of the session,
   * when you change them the session won't restart and rerender.
   */
  handlers?: SessionHandlers,
) {
  const [sessionState, setSessionState] = useState<{
    session: Session,
    connecting?: Promise<void>,
  }>()
  const [state, setState] = useState<CodeSnippetState>('stopped')
  const [output, setOutput] = useState<CodeSnippetOutput[]>([])

  useEffect(function initSession() {
    if (!codeSnippetID) return

    const newSession = new Session(
      codeSnippetID,
      {
        onStateChange(state) {
          setState(state)
          handlers?.onStateChange?.(state)
        },
        onStderr(stderr) {
          setOutput(o => [...o, { type: 'stderr', value: stderr }])
          handlers?.onStderr?.(stderr)
        },
        onStdout(stdout) {
          setOutput(o => [...o, { type: 'stdout', value: stdout }])
          handlers?.onStdout?.(stdout)
        },
        onClose() {
          handlers?.onClose?.()
        },
      },
      true,
    )

    const connecting = newSession.connect()
      .catch(err => {
        console.error(err)
      })

    setSessionState({ session: newSession, connecting })

    return () => {
      newSession.disconnect()
    }
  },
    // We are excluding handlers from dep array, 
    // because they may have been defined as inlined functions and their identity would change with every rerender.
    [codeSnippetID],
  )

  const stop = useCallback(async () => {
    if (!sessionState) return
    await sessionState.connecting
    await sessionState.session.stop()
  }, [sessionState])

  const run = useCallback(async (code: string) => {
    if (!sessionState) return
    await sessionState.connecting
    await sessionState.session.run(code)
  }, [sessionState])

  const getHostname = useCallback(async (port?: number) => {
    if (!sessionState) return
    await sessionState.connecting
    return sessionState.session.getURL(port)
  }, [sessionState])

  return useMemo(() => ({
    stop,
    run,
    getHostname,
    state,
    output,
  }), [
    stop,
    getHostname,
    run,
    state,
    output,
  ])
}

export default useCodeSnippetSession
