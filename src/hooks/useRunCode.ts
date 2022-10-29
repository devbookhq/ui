import { CodeSnippetExecState, EnvVars, OutResponse } from '@devbookhq/sdk'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { createSessionProcess } from '../utils/createSessionProcess'
import useSession from './useSession'

export enum CodeSnippetExtendedState {
  Loading = 'Loading',
}

export type CodeSnippetState = CodeSnippetExtendedState | CodeSnippetExecState

// TODO: Make the code snippet run cmd and rootdir dynamic depending on template.
const cmd = 'node index.mjs'
const filename = '/code/index.mjs'

function useRunCode(session?: ReturnType<typeof useSession>) {
  const [runTrigger, setRunTrigger] = useState<{ code: string; envVars?: EnvVars }>()
  const [process, setProcess] = useState<{
    process?: Awaited<ReturnType<typeof createSessionProcess>>
    state: CodeSnippetExecState
    output: OutResponse[]
  }>({ state: CodeSnippetExecState.Stopped, output: [] })

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
  }, [process.state, session?.state])

  useEffect(
    function triggerRun() {
      ;(async function () {
        if (!runTrigger) return
        const currentSession = await session?.refresh()

        setProcess({ state: CodeSnippetExecState.Running, output: [] })

        try {
          await currentSession?.session?.filesystem?.write(filename, runTrigger.code)
          const newProcess: Awaited<ReturnType<typeof createSessionProcess>> =
            await createSessionProcess(
              cmd,
              session?.session?.process,
              stdout => setProcess(p => ({ ...p, output: [...p.output, stdout] })),
              stderr => setProcess(p => ({ ...p, output: [...p.output, stderr] })),
              runTrigger.envVars,
            )
          setProcess({
            process: newProcess,
            state: CodeSnippetExecState.Running,
            output: [],
          })
          newProcess.exited.then(() => {
            setProcess(p =>
              p.process === newProcess
                ? { ...p, state: CodeSnippetExecState.Stopped }
                : p,
            )
          })
        } catch (err) {
          setProcess({ state: CodeSnippetExecState.Stopped, output: [] })
          throw err
        }
      })()
    },
    [session?.refresh, runTrigger],
  )

  const stop = useCallback(async () => {
    await process.process?.kill()
  }, [process])

  const run = useCallback(
    async (code: string, envVars?: EnvVars) => {
      await session?.refresh?.()
      setRunTrigger({ code, envVars })
    },
    [session?.refresh],
  )

  return {
    run,
    stop,
    output: process.output,
    state: derivedState,
  }
}

export default useRunCode
