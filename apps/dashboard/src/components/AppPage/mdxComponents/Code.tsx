import { CodeEditor } from '@devbookhq/code-editor'
import { EditorView } from '@codemirror/view'
import { Loader as LoaderIcon } from 'lucide-react'
import {
  OutStderrResponse,
  OutStdoutResponse,
  OutType,
  Process,
} from '@devbookhq/react'
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { oneDark } from '@codemirror/theme-one-dark'
import { useSharedSession } from '@devbookhq/react'
import path from 'path-browserify'

import { rootdir } from 'utils/constants'
import Text from 'components/typography/Text'
import { supportedLanguages } from 'apps/languages'

import CopyToClipboardButton from '../CopyToClipboardButton'
import RunButton from '../RunButton'
import StopButton from '../StopButton'

const darkEditorTheme = EditorView.theme({
  '.cm-gutters': { background: '#282c34' },
  '&': { maxHeight: '600px' },
  '.cm-scroller': { overflow: 'auto' },
})

export interface Props {
  file?: string
  lang?: string
  onRun?: (code: string) => string
  children: ReactNode
  isEditable?: boolean
}

function Code({
  file,
  lang,
  onRun,
  children,
  isEditable,
}: Props) {
  const [process, setProcess] = useState<Process>()
  const [isRunning, setIsRunning] = useState(false)
  const [output, setOutput] = useState<(OutStdoutResponse | OutStderrResponse)[]>([])
  const { session } = useSharedSession()
  const isRunnable = !!onRun

  const appendOutput = useCallback((out: OutStdoutResponse | OutStderrResponse) => {
    setOutput(arr => [...arr, out])
  }, [])

  const run = useCallback(() => {
    if (!onRun) return
    if (!session) return

    const cmd = onRun(children as string)
    setOutput([])
    session.process?.start({
      cmd,
      onStdout: appendOutput,
      onStderr: appendOutput,
      onExit: () => setIsRunning(false),
    }).then(setProcess)
      .catch(err => {
        const e: OutStderrResponse = {
          line: err,
          timestamp: Date.now(),
          type: OutType.Stderr,
        }
        appendOutput(e)
      })
    setIsRunning(true)
  }, [
    onRun,
    session,
    children,
    appendOutput,
  ])

  const handleCopyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(children as string)
  }, [children])

  const stop = useCallback(() => {
    process?.kill()
  }, [
    process,
  ])

  const writeFile = useCallback((content: string) => {
    if (!file) return
    const replacedCode = content
      .replace('\'yourUsername-country-US\'', 'process.env.USERNAME + "-country-US"')
      .replace('\'yourPassword\'', 'process.env.PASSWORD')

    session?.filesystem?.write(path.join(rootdir, file), replacedCode)
  }, [
    session,
    file,
  ])

  useEffect(function writeInitialFile() {
    if (typeof children === 'string') {
      writeFile(children)
    }
  }, [writeFile, children])

  return (
    <div
      style={{
        colorScheme: 'dark',
      }}
      className="
      flex
      flex-col
      flex-1
      border
      border-indigo-400/20
      bg-gray-800
    ">
      <div className="
        py-1
        px-3
        flex
        items-center
        self-stretch
        justify-between
      ">
        <Text
          className="text-gray-400"
          text={file || ''}
        />
        <div />
        <div className="
          flex
          items-center
          space-x-1
        ">
          {isRunnable && (
            <>
              {!isRunning ? (
                <RunButton
                  onClick={run}
                />
              ) : (
                <StopButton
                  onClick={stop}
                />
              )}
            </>
          )}
          <CopyToClipboardButton
            onClick={handleCopyToClipboard}
          />
        </div>
      </div>

      <CodeEditor
        className={isRunnable ? 'not-prose' : 'not-prose rounded-b-lg'}
        content={children as string}
        filename={file ? path.join(rootdir, file) : path.join(rootdir, `dummy-name-${Math.floor(Math.random() * 1000)}.${lang}`)}
        supportedLanguages={supportedLanguages}
        theme={[oneDark, darkEditorTheme]}
        isReadOnly={!isEditable}
        onContentChange={writeFile}
      />
      {isRunnable &&
        <div className="
          pl-4
          pr-2
          py-2
          font-mono
          text-gray-300
          flex
          h-[300px]
          flex-col
          space-y-0.5
        ">
          <div className="
            flex
            items-center
            space-x-1
          ">
            <Text
              className="text-gray-500"
              size={Text.size.S3}
              text="Output"
            />
            {isRunning &&
              <LoaderIcon
                className="
                  text-gray-500
                  animate-spin
                "
                size={14}
              />
            }
          </div>

          <div className="flex flex-1 overflow-auto flex-col scroller">
            {output.map(o => (
              <div
                className="
                flex
                whitespace-pre
                space-x-1
              "
                key={o.timestamp}
              >
                <Text
                  className="text-gray-600"
                  text=">"
                />
                <Text
                  className={o.type === OutType.Stdout ? 'text-gray-400' : 'text-red-500'}
                  text={o.line}
                />
              </div>
            ))}
          </div>
        </div>
      }
    </div>
  )
}

export default Code
