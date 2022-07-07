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
  OpenedPort,
  EnvVars,
} from '@devbookhq/sdk'

export type SessionState = 'open' | 'closed'

export enum CodeSnippetExtendedState {
  Failed = 'Failed'
}

export type CodeSnippetState = CodeSnippetExecState | CodeSnippetExecState

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
  const [csState, setCSState] = useState<CodeSnippetState>(CodeSnippetExecState.Loading)
  const [csOutput, setCSOutput] = useState<OutResponse[]>([])
  const [ports, setPorts] = useState<OpenedPort[]>([])

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
        onScanPorts(newPorts) {
          // TODO: If we were running devbookd as an other user than root this could be
          // easilly filtered like so: p.User === 'user'
          const validPorts = newPorts.filter(
            p => (
              p.State === 'LISTEN' &&
              p.Ip === '0.0.0.0' &&
              // This is devbookd
              p.Port !== 8010 &&
              // ssh daemon
              p.Port !== 22
            )
          )
          setPorts(ps => {
            if (ps.length !== validPorts.length) {
              return validPorts
            }

            // Update ports if the new ports differ in anything from the old ports
            if (!ps.every(p1 => !!validPorts.find(p2 => p2.Ip === p1.Ip && p2.Port === p1.Port && p2.State === p1.State))) {
              return validPorts
            }
            return ps
          })
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

  const run = useCallback(async (code: string, envVars?: EnvVars) => {
    if (sessionState.state !== 'open') return
    setCSOutput([])
    return sessionState.session?.codeSnippet?.run(code, envVars)
  }, [sessionState])

  const getHostname = useCallback(async (port?: number) => {
    if (sessionState.state !== 'open') return
    return sessionState.session?.getHostname(port)
  }, [sessionState])

  return useMemo(() => ({
    stop,
    run,
    getHostname,
    csState,
    terminalManager: sessionState.session?.terminal,
    csOutput,
    open: sessionState.open,
    state: sessionState.state,
    ports,
  }), [
    stop,
    getHostname,
    run,
    sessionState.session?.terminal,
    csState,
    csOutput,
    sessionState.open,
    sessionState.state,
    ports,
  ])
}

export default useSession
