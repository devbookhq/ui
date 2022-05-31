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

export interface Output {
  type: 'stderr' | 'stdout'
  value: string
}

function useSession(
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
  const [session, setSession] = useState<Session>()
  const [state, setState] = useState<CodeSnippetState>('stopped')
  const [output, setOutput] = useState<Output[]>([])

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

    setSession(newSession)

    newSession.connect()
      .catch(err => {
        console.error(err)
      })

    return () => {
      newSession.disconnect()
    }
  },
    // We are excluding handlers from dep array, 
    // because they may have been defined as inlined functions and their identity would change with every rerender.
    [codeSnippetID],
  )

  const stop = useCallback(() => session?.stop(), [session])
  const run = useCallback((code: string) => session?.run(code), [session])
  const getURL = useCallback((port?: number) => session?.getURL(port), [session])

  return useMemo(() => ({
    stop,
    run,
    state,
    output,
    getURL,
  }), [
    stop,
    getURL,
    run,
    state,
    output,
  ])
}

export default useSession
