import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
import {
  Session,
  CodeSnippetExecState,
  ProcessManager,
  OutStdoutResponse,
  OutStderrResponse,
  OutResponse,
  EnvVars,
} from '@devbookhq/sdk'
import { useIdleTimer } from 'react-idle-timer'

import { createDeferredPromise } from '../utils/createDeferredPromise'

export const rootdir = '/code'

export async function createSessionProcess(
  cmd: string,
  manager?: ProcessManager,
  onStdout?: (o: OutStdoutResponse) => void,
  onStderr?: (o: OutStderrResponse) => void,
  processID?: string,
) {
  if (!manager) {
    throw new Error('Cannot create process - process manager is not defined')
  }

  const {
    resolve,
    promise: exited,
  } = createDeferredPromise()

  const onExit = () => {
    resolve()
  }

  const process = await manager.start({
    cmd,
    onStdout,
    onStderr,
    onExit,
    rootdir,
    processID,
  })

  return {
    exited,
    processID: process.processID,
    kill: process.kill,
    sendStdin: process.sendStdin,
  }
}

export type SessionState = 'closed' | 'opening' | 'open'

export enum CodeSnippetExtendedState {
  Failed = 'Failed',
  Loading = 'Loading',
}

export type CodeSnippetState = CodeSnippetExtendedState | CodeSnippetExecState

export interface Opts {
  codeSnippetID?: string
  debug?: boolean
}

function useSession({
  /**
   * If the `codeSnippetID` is undefined the session will not be initialized.
   */
  codeSnippetID,
  /**s
   * If enabled, the edits to a VM's filesystem will be saved for the next session.
   */
  debug,
}: Opts) {
  const [sessionState, setSessionState] = useState<{
    session?: Session
    state: SessionState
    id?: string
    open?: Promise<void>
  }>({ state: 'closed' })
  const [csOutput, setCSOutput] = useState<OutResponse[]>([])
  const [runTrigger, setRunTrigger] = useState<{ code: string, envVars?: EnvVars }>()
  const [csState, setCSState] = useState<CodeSnippetState>(CodeSnippetExecState.Stopped)

  const initSession = useCallback(async () => {
    if (!codeSnippetID) return

    const newSession = new Session({
      id: codeSnippetID,
      codeSnippet: {
        onStateChange: (csState) => {
          setSessionState(s => s.session === newSession ? { ...s, csState } : s)
        },
        onStdout: (stdout) => {
          setCSOutput(output => [...output, stdout])
        },
        onStderr: (stderr) => {
          setCSOutput(output => [...output, stderr])
        },
      },
      onDisconnect() {
        setSessionState(s => s.session === newSession ? { ...s, state: 'closed' } : s)
      },
      onReconnect() {
        setSessionState(s => s.session === newSession ? { ...s, state: 'open' } : s)
      },
      onClose() {
        setSessionState(s => s.session === newSession ? { ...s, state: 'closed' } : s)
      },
      debug,
    })

    const open = newSession.open()
    let close: (() => Promise<void>) | undefined

    setSessionState(oldState => {
      oldState.session?.close().catch((err) => {
        console.error(err)
      })
      return { session: newSession, state: 'opening', id: codeSnippetID, open }
    })

    await open

    setSessionState(s => s.session === newSession ? { ...s, state: 'open' } : s)

    return { session: newSession, close }
  }, [
    debug,
    codeSnippetID,
  ])

  const onIdle = useCallback(() => {
    setSessionState(s => {
      if (s.state === 'closed') return s

      s.session?.close().catch((err) => {
        console.error(err)
      })

      return { state: 'closed' }
    })
  }, [])

  const {
    reset,
  } = useIdleTimer({
    timeout: 15 * 60 * 1000,
    onIdle,
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

  const csDerivedState = useMemo(() => {
    switch (sessionState.state) {
      case 'closed':
        return CodeSnippetExecState.Stopped
      case 'opening':
        return CodeSnippetExtendedState.Loading
      case 'open':
        return csState
    }
  }, [
    csState,
    sessionState.state,
  ])

  useEffect(function triggerRun() {
    (async function () {
      if (!runTrigger || csOutput.length > 0) return
      const { session } = await refresh()
      const newCSState = await session?.codeSnippet?.run(runTrigger.code, runTrigger.envVars)
      if (newCSState) {
        setCSState(newCSState)
      }
    })()
  }, [
    refresh,
    runTrigger,
    sessionState.session?.codeSnippet,
    csOutput,
  ])

  const stopCS = useCallback(async () => {
    setCSState(CodeSnippetExtendedState.Loading)
    const { session } = await refresh()
    const newCSState = await session?.codeSnippet?.stop()
    if (newCSState) {
      setCSState(newCSState)
    }
  }, [sessionState])

  const runCS = useCallback(async (code: string, envVars?: EnvVars) => {
    setCSOutput([])
    setCSState(CodeSnippetExecState.Running)
    setRunTrigger({ code, envVars })
  }, [sessionState])

  return {
    refresh,
    session: sessionState.state === 'open' ? sessionState.session : undefined,
    state: sessionState.state,
    csOutput: csOutput,
    csState: csDerivedState,
    stopCS,
    runCS,
  }
}

export default useSession
