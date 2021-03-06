import path from 'path'
import { EditorView } from '@codemirror/view'
import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type {
  useDevbook,
} from '@devbookhq/sdk'

import createEditorState from '../Editor/createEditorState'
import { Language } from '../Editor/language'
import Text from '../Text'
import { sendEvent } from 'src/analytics'

export interface Props {
  devbook: Pick<ReturnType<typeof useDevbook>, 'fs' | 'status'>
  filepath?: string
  lightTheme?: boolean
  height?: string
}

function Editor({
  filepath,
  devbook: {
    fs,
    status,
  },
}: Props) {
  const editorEl = useRef<HTMLDivElement>(null)
  const [initialContent, setInitialContent] = useState<string>()

  useEffect(function initSelectedFileContent() {
    async function init() {
      if (!fs) return
      if (status !== 'Connected') return
      if (!filepath) return

      const content = await fs.get(filepath)
      setInitialContent(content)
      sendEvent({
        project: 'example-app',
        type: 'open file',
        message: `User opened file "${filepath}"`
      })
    }
    init()
  }, [
    status,
    fs,
    filepath,
  ])

  const saveFile = useCallback(async (content: string, filepath: string) => {
    if (!filepath) return
    if (status !== 'Connected') return
    if (!fs) return

    try {
      await fs.write(filepath, content)
    } catch (err: any) {
      console.error(err)
    } finally {
      sendEvent({
        project: 'example-app',
        type: 'edit file',
        message: `User edited file "${filepath}"`,
        action: 'Show file snapshot',
      })
    }
  }, [
    fs,
    status,
  ])

  const language = useMemo(() => {
    if (!filepath) return
    const ext = path.extname(filepath).replace('.', '')
    return Language[ext as keyof typeof Language] || Language.tsx
  }, [filepath])

  useLayoutEffect(function initEditor() {
    if (!editorEl.current) return
    if (!filepath) return

    const state = createEditorState({
      initialContent: initialContent || '',
      language,
      onContentChange(content) {
        saveFile(content, filepath)
      },
    })

    const view = new EditorView({ state, parent: editorEl.current });
    return () => {
      view.destroy()
    }
  }, [
    initialContent,
    language,
    saveFile,
  ])

  return (
    <div className="flex flex-col flex-1 min-w-0 max-h-full devbook h-full bg-black-700">
      {filepath &&
        <>
          <div className="flex items-start">
            <div className="min-w-[100px] px-2 py-1 border-black-600 bg-black-650 items-center">
              <Text
                mono
                hierarchy={Text.hierarchy.Secondary}
                size={Text.size.Small}
                text={filepath}
              />
            </div>
          </div>
          <div className="flex flex-1 overflow-hidden min-w-0">
            <div
              className="w-full h-full"
              ref={editorEl}
            />
          </div>
        </>
      }
      {!filepath &&
        <div className="flex flex-1 items-center justify-center p-2 text-center">
          <Text
            text="No file selected"
            hierarchy={Text.hierarchy.Secondary}
          />
        </div>
      }
    </div>
  )
}

export default memo(Editor)
