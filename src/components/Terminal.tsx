import { CodeSnippetExecState } from '@devbookhq/sdk'
import clsx from 'clsx'
import React from 'react'
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useState,
} from 'react'
import { useResizeDetector } from 'react-resize-detector'
import type { FitAddon } from 'xterm-addon-fit'

import useTerminal from '../hooks/useTerminal'
import { useProvidedSession } from '../utils/SessionProvider'
import SpinnerIcon from './icons/Spinner'
import Text from './typography/Text'

export interface Handler {
  handleInput: (input: string) => void
  focus: () => void
  resize: () => void
  runCmd: (cmd: string) => Promise<void>
  stopCmd: () => void
}

export interface Props {
  autofocus?: boolean
  onStart?: (handler: Omit<Handler, 'runCmd' | 'stopCmd'>) => Promise<void> | void
  onRunningCmdChange?: (state: CodeSnippetExecState) => void
}

const Terminal = forwardRef<Handler, Props>(
  ({ onStart, autofocus, onRunningCmdChange }, ref) => {
    const { session } = useProvidedSession()

    const [fitAddon, setFitAddon] = useState<FitAddon>()
    const [terminalRef, setTerminalRef] = useState<HTMLDivElement | null>(null)
    const {
      terminal,
      terminalSession,
      error: errMessage,
      isLoading,
      runCmd,
      isCmdRunning,
      stopCmd,
    } = useTerminal({ terminalManager: session?.terminal })

    const onResize = useCallback(() => {
      if (!fitAddon) return

      const dim = fitAddon.proposeDimensions()

      if (!dim) return
      if (isNaN(dim.cols) || isNaN(dim.rows)) return

      fitAddon.fit()
    }, [fitAddon])

    const assignRefs = useCallback((el: HTMLDivElement | null) => {
      setTerminalRef(el)
      sizeRef.current = el
    }, [])

    const handleInput = useCallback(
      (input: string) => terminalSession?.sendData(input),
      [terminalSession],
    )

    const focus = useCallback(() => {
      terminal?.focus()
    }, [terminal])

    const { ref: sizeRef } = useResizeDetector({ onResize })

    useImperativeHandle(
      ref,
      () => ({
        handleInput,
        focus,
        runCmd,
        stopCmd,
        resize: onResize,
      }),
      [handleInput, focus, runCmd, stopCmd, onResize],
    )

    useEffect(
      function updateCmdState() {
        onRunningCmdChange?.(
          isCmdRunning ? CodeSnippetExecState.Running : CodeSnippetExecState.Stopped,
        )
      },
      [isCmdRunning, onRunningCmdChange],
    )

    useLayoutEffect(
      function attachTerminal() {
        ;(async function () {
          if (!terminalRef) return
          if (!terminal) return
          if (errMessage) return
          if (isLoading) return

          const fit = await import('xterm-addon-fit')
          const webLinks = await import('xterm-addon-web-links')

          terminal.loadAddon(new webLinks.WebLinksAddon())

          const fitAddon = new fit.FitAddon()
          terminal.loadAddon(fitAddon)

          terminal.open(terminalRef)
          fitAddon.fit()

          setFitAddon(fitAddon)

          if (autofocus) terminal.focus()
        })()
      },
      [terminal, autofocus, isLoading, errMessage],
    )

    useEffect(
      function handleOnStart() {
        if (!onStart) return
        if (!focus) return
        if (!handleInput) return

        onStart({
          handleInput,
          focus,
          resize: onResize,
        })
      },
      [onStart, focus, handleInput, onResize],
    )

    return (
      <>
        {errMessage && (
          <div
            className={clsx(
              'flex-1',
              'flex',
              'justify-center',
              'items-center',
              'bg-black-850',
            )}
          >
            f
            <Text
              className="text-red-400"
              size={Text.size.S2}
              text={errMessage}
            />
          </div>
        )}

        {isLoading && !errMessage && (
          <div
            className={clsx(
              'flex-1',
              'flex',
              'justify-center',
              'items-center',
              'bg-black-850',
            )}
          >
            <SpinnerIcon />
          </div>
        )}

        <div className={clsx('flex-1', 'p-1', 'flex', 'bg-black-850')}>
          {/*
           * We assign the `sizeRef` and the `terminalRef` to a child element intentionally
           * because the fit addon for xterm.js resizes the terminal based on the PARENT'S size.
           * The child element MUST have set the same width and height of it's parent, hence
           * the `w-full` and `h-full`.
           */}
          <div
            ref={assignRefs}
            className="
              h-full
              w-full
            "
          />
        </div>
      </>
    )
  },
)

Terminal.displayName = 'Terminal'

export default Terminal
