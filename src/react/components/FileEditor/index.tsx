import {
  useEffect,
  useCallback,
} from 'react'

import type {
  useDevbook,
} from '@devbookhq/sdk'
import Editor from '../Editor'
import { Language } from '../Editor/language'

export interface Props {
  devbook: Pick<ReturnType<typeof useDevbook>, 'fs' | 'status'>
  language?: Language
  filepath: string
  children?: string
}

function FileEditor({
  devbook: {
    fs,
    status,
  },
  language,
  filepath,
  children: initialContent,
}: Props) {
  const updateContent = useCallback(async content => {
    if (status !== 'Connected') return
    if (!fs) return
    if (!filepath) return

    try {
      await fs.write(filepath, content)
    } catch (err) {
      console.error(err)
    }
  }, [
    fs,
    status,
    filepath,
  ])

  useEffect(function updateInitialContent() {
    updateContent(initialContent)
  }, [
    initialContent,
    updateContent,
  ])

  return (
    <div className="dbk-editor-wrapper">
      <Editor
        filepath={filepath}
        language={language}
        initialContent={initialContent}
        onContentChange={updateContent}
      />
    </div>
  )
}

export default FileEditor
