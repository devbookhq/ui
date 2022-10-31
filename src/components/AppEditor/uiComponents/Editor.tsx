import { CodeEditor, useLanguageServer, useProvidedSession } from '@devbookhq/react'
import clsx from 'clsx'
import { File } from 'lucide-react'
import { Code } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ComponentProps } from 'react'

import Text from 'components/typography/Text'

import { showErrorNotif } from 'utils/notification'

export function Icon() {
  return <Code size="20px" />
}

export interface Props {
  files?: {
    name: string
    content: string
    language: ComponentProps<typeof CodeEditor>['language']
  }[]
  isEditable?: boolean
  isInEditor?: boolean
}

function Editor({ files: initialFiles = [], isEditable = true, isInEditor }: Props) {
  const [files, setFiles] = useState(initialFiles)
  const [selectedFileIdx, setSelectedFileIdx] = useState(0)

  const { session } = useProvidedSession()

  const [startLS, setStartLS] = useState(false)

  const { server: languageServer, error: languageServerError } = useLanguageServer({
    session: startLS ? session : undefined,
    language: 'Nodejs',
    debug: true,
  })

  useEffect(function delayedLSStart() {}, [session?.filesystem])

  useEffect(
    function logError() {
      console.error(languageServerError)
    },
    [languageServerError],
  )

  const handleContentChange = useCallback(
    (content: string) => {
      setFiles(files => {
        const newFiles = [...files]
        if (files.length > selectedFileIdx) {
          const file = files[selectedFileIdx]

          newFiles[selectedFileIdx].content = content
          if (!isInEditor) {
            session?.filesystem
              ?.write(file.name, content)
              .catch(err => showErrorNotif(JSON.stringify(err)))
          }
          return newFiles
        }
        return files
      })
    },
    [selectedFileIdx, session?.filesystem, isInEditor],
  )

  useEffect(
    function writeAllFile() {
      if (isInEditor) return

      Promise.all(files.map(f => session?.filesystem?.write(f.name, f.content))).catch(
        err => showErrorNotif(JSON.stringify(err)),
      )
    },
    [session?.filesystem, files, isInEditor],
  )

  useEffect(
    function reinitialize() {
      setSelectedFileIdx(0)
      setFiles(initialFiles)
    },
    [initialFiles],
  )

  const selectedFile = useMemo(
    () => (files.length > selectedFileIdx ? files[selectedFileIdx] : undefined),
    [selectedFileIdx, files],
  )
  const [fileInitContent, setFileInitContent] = useState(selectedFile?.content)

  useEffect(
    function switchTabContent() {
      setFileInitContent(selectedFile?.content)
    },
    [selectedFileIdx, selectedFile],
  )

  return (
    <div
      className={clsx(
        'h-full',
        'm-1',
        'lg:h-auto',
        'w-full',
        'flex',
        'border',
        'flex-col',
        'rounded-lg',
        'bg-white',
        'flex-1',
        'overflow-hidden',
        'border-slate-200',
      )}
    >
      {!!files.length && (
        <div
          className="
        flex
        flex-row
        items-center
        space-x-3
        border-b
        border-slate-200
        p-3
      "
        >
          {files.map((t, i) => (
            <Text
              key={t.name}
              text={t.name}
              size={Text.size.S3}
              icon={<File size="16px" />}
              className={clsx('cursor-pointer rounded', {
                'text-slate-500': selectedFileIdx === i,
                'text-slate-400 hover:text-slate-500': selectedFileIdx !== i,
              })}
              onClick={() => {
                setSelectedFileIdx(i)
                setFileInitContent(files[i].content)
              }}
            />
          ))}
        </div>
      )}
      <div
        className="
        relative
        flex-1
        overflow-hidden
      "
      >
        <CodeEditor
          languageServer={languageServer}
          language={selectedFile?.language}
          content={fileInitContent}
          isReadOnly={!isEditable}
          onContentChange={handleContentChange}
          className="absolute inset-0"
        />
      </div>
    </div>
  )
}

export default Editor
