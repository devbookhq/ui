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
  OpenedPort,
  EnvVars,
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
  const [deps, setDeps] = useState<string[]>() // Intentionally set to `undefined` as an initial value.
  const [ports, setPorts] = useState<OpenedPort[]>([])

  //const updatePorts = useCallback((newPorts: OpenedPort[]) => {
  //  if (newPorts.length !== ports.length) {
  //    setPorts(newPorts)
  //  } else {
  //    // Compare two arrays and break
  //    // the first time we don't find
  //    // a new port in current ports.
  //    for (const np of newPorts) {
  //      console.log('Comparing NP', { np })
  //      const found = ports.find(p => p.Ip === np.Ip && p.Port === np.Port)
  //      console.log('\tFound?', { found })
  //      if (!found) {
  //        setPorts(newPorts)
  //        break
  //      }
  //    }
  //  }

  //}, [ports])

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
          // TODO: This triggers re-render on each `onScanPorts` callback.
          setPorts(validPorts)
          //if (validPorts.length !== ports.length) {
          //  setPorts(validPorts)
          //} else {
          //  // Compare two arrays and break
          //  // the first time we don't find
          //  // a new port in current ports.
          //  for (const vp of validPorts) {
          //    console.log('Comparing VP', { vp })
          //    const found = ports.find(p => p.Ip === vp.Ip && p.Port === vp.Port)
          //    console.log('\tFound?', { found })
          //    if (!found) {
          //      setPorts(validPorts)
          //    }
          //  }
          //}
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
    ports,
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
    ports,
  ])
}

export default useSession
