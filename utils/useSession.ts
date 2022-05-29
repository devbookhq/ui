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

function useSession(
  codeSnippetID: string,
  /**
   * Handlers are excluded from the dependency array of the session,
   * when you change them the session won't restart and rerender.
   */
  handlers?: SessionHandlers,
) {
  const [session, setSession] = useState<Session>()
  const [state, setState] = useState<CodeSnippetState>('stopped')

  useEffect(function initSession() {
    console.log('reinitializing session')
    const newSession = new Session(
      codeSnippetID,
      {
        onStateChange(state) {
          setState(state)
          handlers?.onStateChange?.(state)
        },
        onStdout: handlers?.onStdout,
        onStderr: handlers?.onStderr,
        onClose: handlers?.onClose,
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

  return useMemo(() => ({
    stop,
    run,
    state,
  }), [
    stop,
    run,
    state,
  ])
}

export default useSession
