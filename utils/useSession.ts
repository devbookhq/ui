import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
import {
  Session,
  CodeSnippetState,
  StateHandler,
  StdoutHandler,
  StderrHandler,
} from '@devbookhq/sdk'

export interface SessionHandlers {
  onStateChange?: StateHandler
  onStderr?: StderrHandler
  onStdout?: StdoutHandler
}

function useSession(
  codeSnippetID: string,
  handlers?: SessionHandlers,
) {
  const [session, setSession] = useState<Session>()
  const [state, setState] = useState<CodeSnippetState>('stopped')

  useEffect(function initSession() {
    const newSession = new Session(codeSnippetID)
    setSession(newSession);

    (async function () {
      try {
        await newSession.connect()

        await newSession.subscribe('state', (state) => {
          handlers?.onStateChange?.(state)
          setState(state)
        })
        await newSession.subscribe('stderr', (stderr) => {
          handlers?.onStderr?.(stderr)
        })
        await newSession.subscribe('stdout', (stdout) => {
          handlers?.onStdout?.(stdout)
        })
      } catch (e) {
        console.error(e)
      }
    })();

    return () => {
      newSession.stop()
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
