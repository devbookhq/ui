import { useMemo } from 'react'
import cn from 'classnames'

import { CodeSnippetOutput } from 'utils/useSession'

export interface Props {
  output: CodeSnippetOutput[]
  className?: string
}

function Output({
  className,
  output,
}: Props) {
  // We are recreating the output array when we add new outputs, so we can use it as a dependency here.
  const reversedOutput = useMemo(() => output.slice().reverse(), [output])

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
      'whitespace-pre',
      'leading-tight',
      className,
    )}
    >
      {reversedOutput.map((o, i) =>
        <div
          key={i}
          className={o.type === 'stderr' ? 'text-red-400' : 'text-white-900'}
        >
          {o.value}
        </div>
      )}
    </div>
  )
}

export default Output
