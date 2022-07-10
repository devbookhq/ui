import { useMemo } from 'react'
import cn from 'classnames'
import {
  OutResponse,
  OutType,
} from '@devbookhq/sdk'

export interface Props {
  output: OutResponse[]
  className?: string
}

// TODO: Due to the clock drift the timestamps will be almost always showing wrong time.
// function parseTimestamp(t: number) {
//   // Timestamp is in nanoseconds.
//   const mili = t / 1_000_000
//   const d = new Date(mili)

//   const min = d.getMinutes()
//   const minStr = min < 10 ? `0${min}` : `${min}`

//   const h = d.getHours()
//   const hStr = h < 10 ? `0${h}` : `${h}`

//   const sec = d.getSeconds()
//   const secStr = sec < 10 ? `0${sec}` : `${sec}`

//   return `${hStr}:${minStr}:${secStr}:${d.getMilliseconds()}`
// }

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
          {/* <span className="text-gray-600">{parseTimestamp(o.timestamp)}</span> */}
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
