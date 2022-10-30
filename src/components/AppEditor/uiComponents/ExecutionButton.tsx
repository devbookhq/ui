import { CodeSnippetExecState } from '@devbookhq/sdk'
import clsx from 'clsx'
import { Play, Square } from 'lucide-react'
import { ReactNode, useEffect, useState } from 'react'

import Button from 'components/Button'
import SpinnerIcon from 'components/icons/Spinner'

import { CodeSnippetExtendedState, CodeSnippetState } from './Terminal'

export interface Props {
  state: CodeSnippetState
  onRunClick: (e: any) => void
  onStopClick: (e: any) => void
}

interface UI {
  text: 'Loading...' | 'Run' | 'Stop' | 'Error'
  icon: ReactNode
}

const loadingUI: UI = {
  text: 'Loading...',
  icon: <SpinnerIcon />,
}

const stoppedUI: UI = {
  text: 'Run',
  icon: <Play size="14px" />,
}

const runningUI: UI = {
  text: 'Stop',
  icon: <Square size="14px" />,
}

const failedUI: UI = {
  text: 'Error',
  icon: null,
}

function ExecutionButton({ state, onRunClick, onStopClick }: Props) {
  const [ui, setUI] = useState<UI>(loadingUI)

  useEffect(
    function updateUI() {
      switch (state) {
        case CodeSnippetExecState.Stopped:
          setUI(stoppedUI)
          break
        case CodeSnippetExecState.Running:
          setUI(runningUI)
          break
        case CodeSnippetExtendedState.Loading:
          setUI(loadingUI)
          break
        case CodeSnippetExtendedState.Failed:
          setUI(failedUI)
          break
      }
    },
    [state],
  )

  function handleClick(e: any) {
    if (state === CodeSnippetExecState.Stopped) {
      // Make UI responsive by immediately it without waiting for server's response.
      setUI(runningUI)
      onRunClick(e)
    }

    if (state === CodeSnippetExecState.Running) {
      onStopClick(e)
    }
  }

  return (
    <Button
      variant={Button.variant.Uncolored}
      onClick={handleClick}
      className={clsx(
        'rounded-lg border-transparent bg-green-500 px-2 py-1.5 text-white hover:bg-green-600',
        {
          'bg-slate-300':
            state === CodeSnippetExtendedState.Loading ||
            state === CodeSnippetExtendedState.Failed,
        },
      )}
      text={ui.text}
      isDisabled={state === CodeSnippetExtendedState.Loading}
      icon={ui.icon}
    />
  )
}

export default ExecutionButton
