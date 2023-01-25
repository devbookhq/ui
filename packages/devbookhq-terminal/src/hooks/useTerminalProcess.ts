import {
  EnvVars,
  TerminalManager,
} from '@devbookhq/sdk'
import type { Terminal as XTermTerminal } from 'xterm'
import { createDeferredPromise } from '../utils/createDeferredPromise'
import {
  useCallback,
  useState,
} from 'react'

export interface TerminalProcess {
  exited: Promise<void>
  kill: () => Promise<void>
  /**
   * Disconnect terminal process from Xterm
   */
  disconnect: () => void
}

export interface UseTerminalProcessOpts {
  terminal?: XTermTerminal,
  terminalManager?: TerminalManager
  canStart: boolean
  onOutput?: (output: string) => void
}

async function createTerminalProcess({
  cmd,
  terminal,
  terminalManager,
  rootdir,
  envVars = {},
  onOutput,
}: {
  terminal: XTermTerminal,
  terminalManager: TerminalManager,
  cmd: string,
  rootdir?: string,
  envVars?: EnvVars,
  onOutput?: (output: string) => void,
}): Promise<TerminalProcess> {
  const {
    resolve: onExit,
    promise: exited,
  } = createDeferredPromise()

  const session = await terminalManager.createSession({
    onData: data => {
      terminal.write(data),
        onOutput?.(data)
    },
    onExit,
    size: {
      cols: terminal.cols,
      rows: terminal.rows,
    },
    cmd,
    rootdir,
    envVars,
  })

  const disposeOnData = terminal.onData(data => session.sendData(data))
  const disposeOnResize = terminal.onResize(size => session.resize(size))

  function cleanup() {
    disposeOnData.dispose()
    disposeOnResize.dispose()
  }

  exited.finally(cleanup)

  return {
    disconnect: () => {
      cleanup()
    },
    kill: async () => {
      try {
        cleanup()
        await session.destroy()
      } finally {
        onExit()
      }
    },
    exited,
  }
}

function useTerminalProcess({
  terminalManager,
  terminal,
  onOutput,
}: UseTerminalProcessOpts) {
  const [terminalProcess, setTerminalProcess] = useState<TerminalProcess>()

  const createProcess = useCallback(async ({
    cmd,
    envVars = {},
    rootdir = '/',
  }: {
    cmd: string,
    rootdir?: string,
    envVars?: EnvVars,
  }) => {
    if (!terminalManager) return
    if (!terminal) return

    terminalProcess?.disconnect()

    terminalProcess?.kill().catch(err => {
      setTerminalProcess(t => t === terminalProcess ? undefined : t)
    })

    const termProcess = await createTerminalProcess({
      cmd,
      rootdir,
      envVars,
      terminal,
      terminalManager,
      onOutput,
    })

    termProcess.exited.finally(() => {
      setTerminalProcess(t => t === termProcess ? undefined : t)
    })

    setTerminalProcess(termProcess)

    return termProcess
  }, [
    terminal,
    terminalManager,
    terminalProcess,
    onOutput,
  ])

  return {
    createProcess,
    process: terminalProcess,
  }
}

export default useTerminalProcess
