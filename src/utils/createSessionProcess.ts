import {
  EnvVars,
  OutStderrResponse,
  OutStdoutResponse,
  ProcessManager,
} from '@devbookhq/sdk'

import { createDeferredPromise } from './createDeferredPromise'

export async function createSessionProcess(
  cmd: string,
  manager?: ProcessManager,
  onStdout?: (o: OutStdoutResponse) => void,
  onStderr?: (o: OutStderrResponse) => void,
  envVars?: EnvVars,
  rootdir?: '/code',
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
    envVars,
  })

  return {
    exited,
    processID: process.processID,
    kill: process.kill,
    sendStdin: process.sendStdin,
  }
}
