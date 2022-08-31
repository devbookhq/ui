import React, { useMemo } from 'react'
import cn from 'classnames'
import {
  OutResponse,
  OutType,
} from '@devbookhq/sdk'

export interface Props {
  output: OutResponse[]
  className?: string
}

function Output({
  className,
  output,
}: Props) {
  // We are recreating the output array when we add new outputs, so we can use it as a dependency here.
  const sorted = useMemo(() => output.sort((a, b) => b.timestamp - a.timestamp), [output])

  return (
    <div className={cn(
      'p-2',
      'font-mono',
      'text-xs',
      'cs-output',
      'flex',
      'flex-1',
      'flex-col-reverse',
      'overflow-auto',
      'whitespace-pre-wrap',
      'leading-tight',
      className,
    )}
    >
      {sorted.map((o, idx) =>
        <div
          key={idx}
          className="
            flex
            flex-row
            items-start
            space-x-2
          "
        >
          <span
            className={o.type === OutType.Stderr ? 'text-red-400' : 'text-white-900'}
          >
            {o.line}
          </span>
        </div>
      )}
    </div>
  )
}

export default Output
