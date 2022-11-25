import type { OutStderrResponse, OutStdoutResponse, ProcessManager } from '@devbookhq/sdk'

import { createDeferredPromise } from './createDeferredPromise'

export async function createSessionProcess(
  cmd: string,
  rootdir: string,
  manager?: ProcessManager,
  onStdout?: (o: OutStdoutResponse) => void,
  onStderr?: (o: OutStderrResponse) => void,
  processID?: string,
) {
  if (!manager) {
    throw new Error('Cannot create process - process manager is not defined')
  }

  const { resolve, promise: exited } = createDeferredPromise()

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
