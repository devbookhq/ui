import { CodeEditor } from '@devbookhq/code-editor'
import { EditorView } from '@codemirror/view'
import { Loader as LoaderIcon } from 'lucide-react'
import {
  OutStderrResponse,
  OutStdoutResponse,
  OutType,
  Process,
} from '@devbookhq/react'
import {
  ReactNode,
  useCallback,
  useState,
} from 'react'
import { oneDark } from '@codemirror/theme-one-dark'
import { useSharedSession } from '@devbookhq/react'
import path from 'path-browserify'

import { rootdir } from 'utils/constants'
import CopyToClipboardButton from '../CopyToClipboardButton'
import RunButton from '../RunButton'
import StopButton from '../StopButton'
import Text from 'components/typography/Text'
import { supportedLanguages } from 'apps/languages'

const darkEditorTheme = EditorView.theme({ '.cm-gutters': { background: '#282c34' } })

export interface Props {
  title?: string
  lang?: 'js' | 'ts' | 'sql' | 'prisma'
  onRun?: (code: string) => string
  children: ReactNode
  enableDiagnostic?: boolean
}

function CodeBlock({
  title,
  lang,
  onRun,
  children,
  enableDiagnostic,
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

  return (
    <div className="
      mt-5
      mb-8
      flex
      flex-col
      rounded-lg
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
          text={title || ''}
        // typeface={Text.typeface.MonoRegular}
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

      <div className="
        relative
        rounded-b-lg
      ">
        <CodeEditor
          className={isRunnable ? 'not-prose' : 'not-prose rounded-b-lg'}
          content={children as string}
          filename={path.join(rootdir, `dummy-name-${Math.floor(Math.random() * 1000)}.${lang}`)}
          supportedLanguages={supportedLanguages}
          theme={[oneDark, darkEditorTheme]}
          isReadOnly
        />
      </div>

      {isRunnable &&
        <div className="
          pt-2
          pb-1
          px-3
          font-mono
          text-gray-300
          text-sm
          flex
          flex-col
          space-y-1
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
            // typeface={Text.typeface.InterSemibold}
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

          {output.map(o => (
            <div
              className="
                flex
                items-center
                space-x-1
              "
              key={o.timestamp}
            >
              <Text
                className="text-gray-600"
                text=">"
              // typeface={Text.typeface.MonoRegular}
              />
              <Text
                className={o.type === OutType.Stdout ? 'text-gray-400' : 'text-red-500'}
                text={o.line}
              // typeface={Text.typeface.MonoRegular}
              />
            </div>
          ))}
        </div>
      }
    </div>
  )
}

export default CodeBlock
