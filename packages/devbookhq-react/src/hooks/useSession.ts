import {
  CodeSnippetExecState,
  Session,
  SessionOpts,
} from '@devbookhq/sdk'
import {
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useIdleTimer } from 'react-idle-timer'

export type SessionState = 'closed' | 'opening' | 'open'

export enum CodeSnippetExtendedState {
  Failed = 'Failed',
  Loading = 'Loading',
}

export type CodeSnippetState = CodeSnippetExtendedState | CodeSnippetExecState

export interface Opts extends Omit<SessionOpts, 'onClose' | 'onReconnect' | 'onDisconnect' | 'id'> {
  inactivityTimeout?: number
  codeSnippetID?: string

  onUserIdle?: () => void
  onUserActive?: () => void
  __stress?: number
}

export function useSession({
  /**
   * If the `codeSnippetID` is undefined the session will not be initialized.
   */
  codeSnippetID,
  /**
   * If enabled, the edits to a VM's filesystem will be saved for the next session.
   */
  debug,
  /**
   * If defined the session will close after the specified time (in ms) of inactivity from user.
   *
   * To disable closing session when inactive the value of this argument should be `0`.
   *
   * The default inactivity timeout is 15 minutes.
   */
  inactivityTimeout = 15 * 60 * 1000,
  apiKey,
  editEnabled,
  onUserIdle,
  onUserActive,
  __debug_devEnv,
  __debug_hostname,
  __debug_port,
  __stress,
}: Opts) {
  const [sessionState, setSessionState] = useState<{
    session?: Session,
    state: SessionState,
    id?: string,
    open?: Promise<void>
  }>({ state: codeSnippetID ? 'opening' : 'closed' })

  const [stress, setStress] = useState<Session[]>([])

  const initSession = useCallback(async () => {
    if (!codeSnippetID) return

    if (__stress) {
      const tests = new Array(__stress).fill(undefined)

      const sessions: Session[] = []

      for (const _ of tests) {
        const s = new Session({
          id: codeSnippetID,
          debug,
        })

        s.open().then(() => {
          s.filesystem?.read('/etc/hosts').then(r => console.log(r))
        })

        sessions.push(s)
      }

      // const stressSessions = await Promise.all(tests.map(async (_, i) => {
      //   const s = new Session({
      //     id: codeSnippetID,
      //     debug,
      //   })

      //   console.log('opening stress test session', i)
      //   await s.open()

      //   return s
      // }))

      setStress(sessions)
    }


    const newSession = new Session({
      id: codeSnippetID,
      apiKey,
      editEnabled,
      __debug_devEnv,
      __debug_hostname,
      __debug_port,
      onDisconnect() {
        setSessionState(s => s.session === newSession ? {
          ...s,
          state: 'opening',
        } : s)
      },
      onReconnect() {
        setSessionState(s => s.session === newSession ? {
          ...s,
          state: 'open',
        } : s)
      },
      onClose() {
        setSessionState(s => s.session === newSession ? {
          ...s,
          state: 'closed',
        } : s)
      },
      debug,
    })

    const open = newSession.open()
    let close: (() => Promise<void>) | undefined

    setSessionState(oldState => {
      oldState.session?.close().catch((err) => {
        console.error(err)
      })
      return {
        session: newSession,
        state: 'opening',
        id: codeSnippetID,
        open,
      }
    })

    await open

    setSessionState(s => s.session === newSession ? {
      ...s,
      state: 'open',
    } : s)

    return {
      session: newSession,
      close,
    }
  }, [
    debug,
    codeSnippetID,
    apiKey,
    editEnabled,
    __debug_devEnv,
    __debug_hostname,
    __debug_port,
    __stress,
  ])

  const onIdle = useCallback(() => {
    if (!inactivityTimeout) return

    setSessionState(s => {
      if (s.state === 'closed') return s

      s.session?.close().catch((err) => {
        console.error(err)
      })

      return { state: 'closed' }
    })
    onUserIdle?.()
  }, [inactivityTimeout, onUserIdle])

  const { reset } = useIdleTimer({
    timeout: inactivityTimeout,
    onIdle,
    onActive: onUserActive,
  })

  /**
   * This function resets the idle timer and creates a new session if the current one is not active.
   */
  const refresh = useCallback(async () => {
    reset()
    if (sessionState.state === 'closed') {
      const result = await initSession()
      return { session: result?.session }
    } else {
      await sessionState.open
      return { session: sessionState.session }
    }
  }, [
    sessionState,
    initSession,
    reset,
  ])

  useEffect(function startSession() {
    const result = initSession()

    return () => {
      result.then(r => r?.close?.())
    }
  }, [initSession])


  return {
    refresh,
    session: sessionState.state === 'open' ? sessionState.session : undefined,
    state: sessionState.state,
  }
}
