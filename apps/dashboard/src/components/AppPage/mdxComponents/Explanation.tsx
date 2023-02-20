import { ReactNode, useEffect, useMemo, useState } from 'react'
import { parseNumericRange } from 'utils/parseNumericRange'
import { useAppContext } from '../AppContext'

export interface Props {
  children?: ReactNode
  // Expression like 1-10,20-30
  lines?: string
}

function Explanation({ children, lines }: Props) {
  const parsedLines = useMemo(() => lines ? parseNumericRange(lines) : undefined, [lines])
  const [, setAppCtx] = useAppContext()


  // Get id 

  // react to editor line hover over the specified lines by activiting self hover and highlighted lines in the code

  const [isActive, setIsActive] = useState(false)
  useEffect(function propagateToAppState() {
    if (!parsedLines) return
    if (!isActive) return

    // add this explanation to app context

    return () => {
      // remove this explanation from app context
    }
  }, [isActive, parsedLines])

  return (
    <div
      className="my-2 hover:bg-slate-300 rounded transition-all cursor-pointer border"
      onMouseOver={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
    >
      {children}
    </div>
  )
}

export default Explanation
