import { TerminalManager } from '@devbookhq/sdk'

import { createDeferredPromise } from './createDeferredPromise'

export const newLine = '\n'

export async function createTerminalProcess(
  cmd: string,
  manager: TerminalManager,
  onData?: (data: string) => void,
) {
  let hasStarted = false
  let isRunning = false

  const { resolve, promise: finished } = createDeferredPromise()

  const finish = () => {
    isRunning = false
    resolve()
  }

  const term = await manager.createSession({
    onData: data => onData?.(data),
    onChildProcessesChange: cps => {
      if (cps.length > 0) {
        hasStarted = true
        isRunning = true
      } else {
        if (hasStarted) {
          finish()
        }
      }
    },
    size: { cols: 9999, rows: 9999 },
  })

  await term.sendData(cmd + newLine)

  // Ensure that even if the command finished so quickly that it was not reported from the env this function finsihes
  setTimeout(() => {
    hasStarted = true
    if (!isRunning) {
      finish()
    }
  }, 10_000)

  return {
    finished,
    sendData: term.sendData,
    destroy: () => {
      term.destroy()
      finish()
    },
  }
}
