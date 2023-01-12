import { CodeSnippetExecState, Session } from '@devbookhq/sdk'
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'
import { useResizeDetector } from 'react-resize-detector'
import type { Terminal as XTermTerminal } from 'xterm'
import type { FitAddon } from 'xterm-addon-fit'

import useTerminalProcess, { TerminalProcess } from '../hooks/useTerminalProcess'
import useTerminalSession from '../hooks/useTerminalSession'
import Spinner from './Spinner'
import Text from './Text'

export interface Handler {
  focus: () => void
  resize: () => void
  runCmd: (cmd: string) => Promise<TerminalProcess | undefined>
  stopCmd: () => Promise<void>
  /**
   * Use ANSI escape codes with this function to manipulate the terminal.
   * 
   * There are several ANSI codes libraries like [`ansi-escapes`](https://www.npmjs.com/package/ansi-escapes).
   * 
   * Here is a quick [overview of ANSI codes](https://gist.github.com/fnky/458719343aabd01cfb17a3a4f7296797).
   */
  write: (content: string) => Promise<void>
  clear: () => void
  getSelection: () => string | undefined
}

export interface Props {
  onLine?: (line: string) => void
  onCopy?: (selection: string) => void
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
  onLine,
  placeholder,
  onCopy,
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
      return termProcess
    } catch (err) {
      const message = err instanceof Error ? err.message : JSON.stringify(err)
      setErrMessage(message)
      terminalSession?.toggleIO(true)
      onRunningCmdChange?.(CodeSnippetExecState.Stopped)
      throw err
    }
  }, [
    createTerminalProcess,
    onRunningCmdChange,
    terminalSession,
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

  useEffect(function initialize() {
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
        allowProposedApi: true,
        disableStdin: isReadOnly,
      })

      if (placeholder && !isPersistent) {
        await new Promise<void>((res, rej) => {
          term.writeln(placeholder, res)
        })
      }

      const { FitAddon } = await import('xterm-addon-fit')
      const fitAddon = new FitAddon()
      term.loadAddon(fitAddon)
      term.open(terminalRef.current)

      setTerminal({
        fitAddon,
        terminal: term,
      })

      if (autofocus) term.focus()

      // // TODO: Switch to WebGL rendering when xterm@5.1.0 and xterm-addon-webgl@0.14.0 is released, fixing Safari and other bugs.
      // // TODO: Use `xterm-addon-canvas` only as a fallback rendering when WebGL support is not available.
      // const { WebglAddon } = await import('xterm-addon-webgl')
      // const webGLAddon = new WebglAddon()
      // term.loadAddon(webGLAddon)
      // webGLAddon.onContextLoss(e => {
      //   // TODO: Improve WebGL context loss handling
      //   webGLAddon.dispose()
      // })

      const { CanvasAddon } = await import('xterm-addon-canvas')
      const canvasAddon = new CanvasAddon()
      term.loadAddon(canvasAddon)

      fitAddon.fit()

      const { WebLinksAddon } = await import('xterm-addon-web-links')
      term.loadAddon(new WebLinksAddon())

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

  useEffect(function handleCopy() {
    if (!onCopy) return
    if (!terminal) return

    terminal.terminal.attachCustomKeyEventHandler((e) => {
      if (!e.composed) return true
      if (e.type !== 'keydown') return true
      const copyShortcut = e.code === 'KeyC' && e.ctrlKey && e.shiftKey
      const macCopyShortcut = e.code === 'KeyC' && e.metaKey

      if (copyShortcut || macCopyShortcut) {
        const selection = terminal.terminal.getSelection()
        if (selection.length > 0) {
          onCopy(selection)
        }
      }
      return true
    })
  }, [onCopy, terminal])

  useEffect(function handleLine() {
    if (!onLine) return
    if (!terminal) return

    let hasUserInput = false

    const onDataDisposer = terminal.terminal.onData((data) => {
      hasUserInput = true
    })

    const onLineFeedDisposer = terminal.terminal.onLineFeed(() => {
      if (hasUserInput) {
        hasUserInput = false

        // TODO: We want to add handling of multiline commands
        const line = terminal.terminal.buffer.active.getLine(terminal.terminal.buffer.active.cursorY - 1)?.translateToString(true)

        if (line && line.length > 0) {
          onLine(line)
        }
      }
    })

    return () => {
      onLineFeedDisposer.dispose()
      onDataDisposer.dispose()
    }
  }, [onLine, terminal])

  const write = useCallback(async (data: string | Uint8Array) => {
    return new Promise<void>((res, rej) => {
      if (!terminal?.terminal) {
        rej()
      } else {
        terminal.terminal.write(data, res)
      }
    })
  }, [terminal?.terminal])

  const clear = useCallback(() => {
    terminal?.terminal.clear()
  }, [terminal?.terminal])

  const getSelection = useCallback(() => terminal?.terminal.getSelection(), [terminal?.terminal])

  useImperativeHandle(
    ref,
    () => ({
      focus,
      runCmd,
      stopCmd,
      resize: onResize,
      write,
      clear,
      getSelection,
    }),
    [
      write,
      getSelection,
      focus,
      clear,
      runCmd,
      stopCmd,
      onResize,
    ],
  )

  return (
    <div className={`py-2 pl-2 flex-1 bg-[#000] flex ${isHidden ? 'hidden' : ''}`}>
      <div
        className="
          flex-1
          flex
          relative
          bg-[#000]
        ">
        {/*
           * We assign the `sizeRef` and the `terminalRef` to a child element intentionally
           * because the fit addon for xterm.js resizes the terminal based on the PARENT'S size.
           * The child element MUST have set the same width and height of it's parent, hence
           * the `w-full` and `h-full`.
           */}
        <div
          ref={terminalRef}
          className="
            terminal
            terminal-wrapper
            absolute
            h-full
            w-full
            bg-[#000]
          " />
        {(errMessage || !terminal || (!terminalSession && isPersistent)) &&
          <div
            className="
              absolute
              h-full
              w-full
              top-0
              left-0
              bg-[#000]
              ">
            <div
              className="
                text-white
                flex
                flex-1
                h-full
                items-center
                justify-center
              ">
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
