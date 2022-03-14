import {
  useEffect,
} from 'react'

import type {
  useDevbook,
} from '@devbookhq/sdk'

export interface Props {
  filepath: string
  children: string
  devbook: Pick<ReturnType<typeof useDevbook>, 'fs' | 'status'>
}

function useCreateFile({
  devbook: {
    fs,
    status,
  },
  filepath,
  children: initialContent,
}: Props) {
  useEffect(function initialize() {
    async function init() {
      if (status !== 'Connected') return
      if (!fs) return
      if (!filepath) return

      await fs.write(filepath, initialContent)
    }
    init()
  }, [
    initialContent,
    status,
    fs,
    filepath,
  ])
}

export default useCreateFile
