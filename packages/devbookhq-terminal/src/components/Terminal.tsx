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
  onRunningCmdChange?: (state: CodeSnippetExecState) => void
  isHidden?: boolean
  canStartTerminalSession: boolean
  isReadOnly?: boolean
  isPersistent?: boolean
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
  isPersistent,
  placeholder,
}, ref) => {
  const [errMessage, setErrMessage] = useState('')
  const [terminal, setTerminal] = useState<{ terminal: XTermTerminal, fitAddon: FitAddon }>()

  const terminalSession = useTerminalSession({
    terminal: terminal?.terminal,
    terminalManager: session?.terminal,
    canStart: canStartTerminalSession && !!isPersistent,
  })

  const {
    createProcess: createTerminalProcess,
    process: currentTerminalProcess,
  } = useTerminalProcess({
    terminal: terminal?.terminal,
    terminalManager: session?.terminal,
    canStart: canStartTerminalSession,
  })

  useEffect(function removeErrorMessage() {
    setErrMessage('')
  }, [
    terminalSession,
    session,
    placeholder,
  ])

  const focus = useCallback(() => {
    terminal?.terminal.focus()
  }, [terminal?.terminal])

  const runCmd = useCallback(async (cmd: string) => {
    setErrMessage('')
    try {
      await new Promise<void>((res, rej) => {
        if (!terminal?.terminal) {
          rej()
        } else {
          terminal.terminal.writeln(cmd, res)
        }
      })

      onRunningCmdChange?.(CodeSnippetExecState.Running)
      terminalSession?.toggleIO(false)
      const termProcess = await createTerminalProcess({
        cmd,
        rootdir,
      })
      termProcess?.exited.finally(() => {
        terminalSession?.toggleIO(true)
        terminalSession?.session.sendData('\n')
        onRunningCmdChange?.(CodeSnippetExecState.Stopped)
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : JSON.stringify(err)
      setErrMessage(message)
      terminalSession?.toggleIO(true)
      onRunningCmdChange?.(CodeSnippetExecState.Stopped)
    }
  }, [
    createTerminalProcess,
    onRunningCmdChange,
    terminalSession,
    terminal?.terminal,
    rootdir,
  ])

  const stopCmd = useCallback(async () => {
    if (!currentTerminalProcess) return
    setErrMessage('')

    try {
      await currentTerminalProcess.kill()
    } catch (err) {
      const message = err instanceof Error ? err.message : JSON.stringify(err)
      setErrMessage(message)
    }
  }, [currentTerminalProcess])

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

      if (placeholder && !isPersistent) {
        await new Promise<void>((res, rej) => {
          term.writeln(placeholder, res)
        })
      }

      const fit = await import('xterm-addon-fit')
      const webLinks = await import('xterm-addon-web-links')

      term.loadAddon(new webLinks.WebLinksAddon())

      const fitAddon = new fit.FitAddon()
      term.loadAddon(fitAddon)

      term.open(terminalRef.current)
      fitAddon.fit()

      setTerminal({
        fitAddon,
        terminal: term,
      })

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
    isPersistent,
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
    <div className={`py-2 pl-2 flex-1 bg-[#000] flex ${isHidden ? 'hidden' : ''}`}>
      <div className="flex-1 flex relative bg-[#000]">
        <div ref={terminalRef} className="terminal terminal-wrapper absolute h-full w-full bg-[#000]" />
        {(errMessage || !terminal || (!terminalSession && isPersistent)) &&
          <div className="absolute h-full w-full top-0 left-0 bg-[#000]">
            <div className="text-white flex flex-1 h-full items-center justify-center">
              {errMessage &&
                <Text
                  color="text-red"
                  text={errMessage}
                />
              }
              {(!terminal || (!terminalSession && isPersistent)) && <Spinner />}
            </div>
          </div>
        }
      </div>
    </div>
  )
})

Terminal.displayName = 'Terminal'

export default Terminal
