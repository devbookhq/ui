import {
  useState,
  useEffect,
} from 'react'

import type {
  useDevbook,
} from '@devbookhq/sdk'

import Editor from '../Editor'
import Spinner from '../SpinnerIcon'
import Output from '../Output'
import { Language } from '../Editor/language'
import Button from '../Button'

type SnippetDevbook = Pick<ReturnType<typeof useDevbook>, 'fs' | 'runCmd' | 'stderr' | 'stdout' | 'status'>

export interface Props {
  devbook: SnippetDevbook
  language?: Language
  children?: string
  autorun?: boolean
  onRun?: (devbook: SnippetDevbook, code: string) => (Promise<void> | void)
}

async function nodeRun(devbook: SnippetDevbook, code: string) {
  if (!devbook.fs) return

  await devbook.fs.write('/index.js', code)
  await devbook.runCmd('node /index.js')
}

function Snippet({
  devbook,
  language,
  onRun = nodeRun,
  autorun,
  children: initialCode,
}: Props) {
  const {
    stdout,
    stderr,
    status,
    fs,
  } = devbook

  const [code, setCode] = useState(initialCode)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(function handleLoading() {
    if (stdout.length > 0 || stderr.length > 0) {
      setIsLoading(false)
    }
  }, [stdout, stderr])

  async function run() {
    if (status !== 'Connected') return
    if (!fs) return
    if (!code) return

    setIsLoading(true)

    await onRun(devbook, code)
  }

  useEffect(function handleAutorun() {
    if (autorun) run()
  }, [
    autorun,
    run,
  ])

  return (
    <div className="space-y-1">
      <Button
        disabled={devbook.status !== "Connected"}
        isLoading={isLoading}
        text="Run"
        onClick={run}
      />
      <Editor
        language={language}
        initialContent={initialCode}
        onContentChange={setCode}
      />
      {(stdout.length > 0 || stderr.length > 0) &&
        <Output
          stdout={stdout}
          stderr={stderr}
          height="200px"
        />
      }
    </div>
  )
}

export default Snippet
