import { CodeSnippetExecState, Session } from '@devbookhq/sdk'
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useState,
} from 'react'
import { useResizeDetector } from 'react-resize-detector'
import type { Terminal as XTermTerminal } from 'xterm'
import type { FitAddon } from 'xterm-addon-fit'

import useTerminalProcess from '../hooks/useTerminalProcess'
import useTerminalSession from '../hooks/useTerminalSession'
import Spinner from './Spinner'
import Text from './Text'

export interface Handler {
  focus: () => void
  resize: () => void
  runCmd: (cmd: string) => Promise<void>
  stopCmd: () => Promise<void>
}

export interface Props {
  autofocus?: boolean
  onRunningCmdChange: (state: CodeSnippetExecState) => void
  isHidden?: boolean
  canStartTerminalSession: boolean
  isReadOnly?: boolean
  placeholder?: string
  rootdir?: string
  session?: Session,
}

const Terminal = forwardRef<Handler, Props>(({
  autofocus,
  session,
  onRunningCmdChange,
  isHidden,
  rootdir = '/',
  canStartTerminalSession,
  isReadOnly,
  placeholder,
}, ref) => {
  const [errMessage, setErrMessage] = useState('')
  const [terminal, setTerminal] = useState<{ terminal: XTermTerminal, fitAddon: FitAddon }>()

  const terminalSession = useTerminalSession({
    terminal: terminal?.terminal,
    terminalManager: session?.terminal,
    canStart: canStartTerminalSession && !isReadOnly,
  })

  const {
    createProcess: createTerminalProcess,
    process: currentTerminalProcess,
  } = useTerminalProcess({
    terminal: terminal?.terminal,
    terminalManager: session?.terminal,
    canStart: canStartTerminalSession,
  })

  useEffect(function reset() {
    setErrMessage('')
  }, [
    terminalSession,
    session,
    placeholder,
  ])

  const focus = useCallback(() => {
    terminal?.terminal.focus()
  },
    [terminal?.terminal])

  const runCmd = useCallback(async (cmd: string) => {
    setErrMessage('')
    try {
      // We are using onMouseDown in the execution button.
      // This hack puts "waits" for all the sync code to execute then refocuses terminal.
      if (terminalSession) {
        setTimeout(focus, 0)
        terminal?.terminal.writeln(cmd)
      } else {
        terminal?.terminal.clear()
      }
      onRunningCmdChange(CodeSnippetExecState.Running)
      terminalSession?.toggleIO(false)
      const termProcess = await createTerminalProcess({
        cmd,
        rootdir,
      })
      termProcess?.exited.finally(() => {
        terminalSession?.toggleIO(true)
        terminalSession?.session.sendData('\n')
        onRunningCmdChange(CodeSnippetExecState.Stopped)
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : JSON.stringify(err)
      setErrMessage(message)
      terminalSession?.toggleIO(true)
      onRunningCmdChange(CodeSnippetExecState.Stopped)
    }
  }, [
    createTerminalProcess,
    onRunningCmdChange,
    terminalSession,
    terminal?.terminal,
    rootdir,
    focus,
  ])

  const stopCmd = useCallback(async () => {
    if (!currentTerminalProcess) return
    setErrMessage('')

    try {
      // We are using onMouseDown in the execution button.
      // This hack puts "waits" for all the sync code to execute then refocuses terminal.
      if (terminalSession) {
        setTimeout(focus, 0)
      }
      await currentTerminalProcess.kill()
    } catch (err) {
      const message = err instanceof Error ? err.message : JSON.stringify(err)
      setErrMessage(message)
    }
  }, [
    currentTerminalProcess,
    focus,
    terminalSession,
  ])

  const onResize = useCallback(() => {
    if (!terminal?.fitAddon) return

    const dim = terminal.fitAddon.proposeDimensions()

    if (!dim) return
    if (isNaN(dim.cols) || isNaN(dim.rows)) return

    terminal.fitAddon.fit()
  }, [terminal?.fitAddon])

  const { ref: terminalRef } = useResizeDetector<HTMLDivElement>({ onResize })

  useLayoutEffect(function initialize() {
    async function init() {
      if (!terminalRef.current) return
      if (!canStartTerminalSession) return

      const xterm = await import('xterm')

      const term = new xterm.Terminal({
        cursorStyle: 'block',
        fontSize: 13,
        theme: {
          background: '#000',
          foreground: '#FFFFFF',
          cursor: '#FFFFFF',
        },
        allowTransparency: true,
        allowProposedApi: true,
        disableStdin: isReadOnly,
      })

      if (placeholder) {
        term.writeln(placeholder)
      }

      const fit = await import('xterm-addon-fit')
      const webLinks = await import('xterm-addon-web-links')

      term.loadAddon(new webLinks.WebLinksAddon())

      const fitAddon = new fit.FitAddon()
      term.loadAddon(fitAddon)

      setTerminal({
        fitAddon,
        terminal: term,
      })

      term.open(terminalRef.current)
      fitAddon.fit()

      if (autofocus) term.focus()

      return term
    }

    const result = init()

    return () => {
      result.then(i => i?.dispose())
    }
  }, [
    canStartTerminalSession,
    terminalRef,
    isReadOnly,
    autofocus,
    placeholder,
  ])

  useImperativeHandle(
    ref,
    () => ({
      focus,
      runCmd,
      stopCmd,
      resize: onResize,
    }),
    [
      focus,
      runCmd,
      stopCmd,
      onResize,
    ],
  )

  return (
    <div className={`w-full h-full relative bg-[#000] ${isHidden ? 'hidden' : ''}`}>
      <div ref={terminalRef} className="terminal terminal-wrapper p-2 h-full w-full bg-[#000]" />
      {(errMessage || !terminal) &&
        <div className="absolute h-full w-full top-0 left-0">
          <div className="text-white flex flex-1 h-full items-center justify-center">
            {errMessage &&
              <Text
                color="text-red"
                text={errMessage}
              />
            }
            {!terminal && <Spinner />}
          </div>
        </div>
      }
    </div>
  )
})

Terminal.displayName = 'Terminal'

export default Terminal
