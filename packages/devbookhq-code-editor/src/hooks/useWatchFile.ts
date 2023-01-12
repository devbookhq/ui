import {
  FilesystemEvent,
  Session,
} from '@devbookhq/sdk'
import { useEffect } from 'react'
import path from 'path-browserify'

export interface Opts {
  filepath: string
  /**
   * When this function changes the hook will resubscribe to the changes in FS -
   * make sure that this function is not inadvertently changed on every render.
   */
  onChange?: (e: FilesystemEvent) => Promise<void> | void
  session?: Session
}

function useWatchFile({
  filepath,
  onChange,
  session,
}: Opts) {
  useEffect(function subscribeToChanges() {
    if (!session?.filesystem) return
    if (!onChange) return

    const dir = path.dirname(filepath)

    const watcher = session.filesystem.watchDir(dir)

    const unsubscribe = watcher.addEventListener((e) => {
      if (e.path === filepath) {
        onChange(e)
      }
    })

    watcher.start()

    return () => {
      unsubscribe()
      watcher.stop()
    }
  }, [
    session,
    onChange,
    filepath,
  ])
}

export default useWatchFile
