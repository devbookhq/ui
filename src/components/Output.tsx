import React, { useMemo } from 'react'
import {
  CodeSnippetExecState,
  OutResponse,
  OutType,
} from '@devbookhq/sdk'

import RunButton from './RunButton'
import {
  CodeSnippetState,
} from '../hooks/useRunCode'

export interface Props {
  output: OutResponse[]
  hasRan?: boolean
  state: CodeSnippetState
  onRunClick?: () => void
  onStopClick?: () => void
}

function Output({
  output,
  hasRan,
  state,
  onRunClick,
  onStopClick,
}: Props) {
  // We are recreating the output array when we add new outputs, so we can use it as a dependency here.
  const sorted = useMemo(() => output.sort((a, b) => b.timestamp - a.timestamp), [output])

  return (
    <div className="
      p-2
      font-mono
      text-xs
      cs-output
      flex
      flex-col-reverse
      overflow-auto
      whitespace-pre
      bg-black-900
      leading-tight
    ">
      {output.length === 0 && !hasRan &&
        <div
          className={`
          dbk-output-line
          flex
          flex-row
          flex-1
          items-center
          justify-center
          space-x-2
          dbk-output-line-stdout text-gray-700
        `}
        >
          <RunButton
            className="bg-transparent"
            textLeft={state === CodeSnippetExecState.Stopped ? 'Click to' : undefined}
            onRunClick={onRunClick}
            onStopClick={onStopClick}
            state={state}
          />
        </div>
      }
      {
        sorted.map((o, idx) =>
          <div
            key={idx}
            className={`
            dbk-output-line
            flex
            flex-row
            items-start
            space-x-2
            ${o.type === OutType.Stderr
                ? 'dbk-output-line-stderr text-red-400'
                : 'dbk-output-line-stdout text-white-900'
              }
          `}
          >
            {o.line}
          </div>
        )
      }
    </div >
  )
}

export default Output
