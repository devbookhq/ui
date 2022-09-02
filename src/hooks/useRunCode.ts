import {
  useEffect,
  useMemo,
  useCallback,
  useState,
} from 'react'
import {
  EnvVars,
  OutResponse,
  CodeSnippetExecState,
} from '@devbookhq/sdk'
import useSession, { createSessionProcess } from './useSession'

export enum CodeSnippetExtendedState {
  Loading = 'Loading',
}

export type CodeSnippetState = CodeSnippetExtendedState | CodeSnippetExecState

// TODO: Make the code snippet run cmd and rootdir dynamic depending on template.
const cmd = 'node index.mjs'
const filename = '/code/index.mjs'

function useRunCode(session?: ReturnType<typeof useSession>) {
  const [output, setOutput] = useState<OutResponse[]>([])
  const [runTrigger, setRunTrigger] = useState<{ code: string, envVars?: EnvVars }>()
  const [process, setProcess] = useState<{
    process?: Awaited<ReturnType<typeof createSessionProcess>>,
    state: CodeSnippetExecState,
  }>({ state: CodeSnippetExecState.Stopped })

  const derivedState = useMemo(() => {
    switch (session?.state) {
      case 'closed':
        return CodeSnippetExecState.Stopped
      case 'opening':
        return CodeSnippetExtendedState.Loading
      case 'open':
        return process.state
      default:
        return CodeSnippetExtendedState.Loading
    }
  }, [
    process.state,
    session?.state,
  ])

  useEffect(function triggerRun() {
    (async function () {
      if (!runTrigger || output.length > 0) return
      const currentSession = await session?.refresh()

      setProcess({ state: CodeSnippetExecState.Running })

      try {
        await currentSession?.session?.filesystem?.writeFile(filename, runTrigger.code)
        const newProcess = await createSessionProcess(
          cmd,
          session?.session?.process,
          (stdout) => setOutput(o => [...o, stdout]),
          (stderr) => setOutput(o => [...o, stderr]),
          runTrigger.envVars,
        )
        setProcess({ process: newProcess, state: CodeSnippetExecState.Running })
        newProcess.exited.then(() => {
          setProcess(p => p.process === newProcess ? { ...p, state: CodeSnippetExecState.Stopped } : p)
        })
      } catch (err) {
        setProcess({ state: CodeSnippetExecState.Stopped })
        throw err
      }
    })()
  }, [
    session?.refresh,
    runTrigger,
    output,
  ])

  const stop = useCallback(async () => {
    await process.process?.kill()
    console.log('killed process')
  }, [process])

  const run = useCallback(async (code: string, envVars?: EnvVars) => {
    await session?.refresh?.()
    setOutput([])
    setRunTrigger({ code, envVars })
  }, [session?.refresh])

  return {
    run,
    stop,
    output,
    state: derivedState,
  }
}

export default useRunCode
