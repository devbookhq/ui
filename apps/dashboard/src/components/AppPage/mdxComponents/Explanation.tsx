import clsx from 'clsx'
import { ReactNode, useEffect, useMemo, useState } from 'react'

import { parseNumericRange } from 'utils/parseNumericRange'
import { useAppContext } from '../AppContext'

export interface Props {
  children?: ReactNode
  // Expression like 1-10,20-30
  lines?: string
  // This helps identifying the actual editor
  file?: string
}

let idCounter = 0

function Explanation({ children, lines }: Props) {
  const parsedLines = useMemo(() => lines ? parseNumericRange(lines) : undefined, [lines])
  const [appCtx, setAppCtx] = useAppContext()
  const [isActive, setIsActive] = useState(false)

  const [id, setID] = useState<number>()
  useEffect(function getComponentID() {
    setID(idCounter++)
  }, [])

  useEffect(function handleEditorHover() {
    if (!parsedLines) return
    if (!appCtx.Code.hoveredLine) return
    if (parsedLines.length === 0) return

    const hasOverlap = parsedLines.includes(appCtx.Code.hoveredLine)
    if (!hasOverlap) return

    setIsActive(true)
    return () => {
      setIsActive(false)
    }
  }, [
    appCtx.Code.hoveredLine,
    parsedLines,
    setIsActive,
  ])

  useEffect(function propagateToAppState() {
    if (id === undefined) return
    if (!parsedLines) return
    if (parsedLines.length === 0) return
    if (!isActive) return

    setAppCtx(d => {
      if (!d.Explanation[id]) {
        d.Explanation[id] = {
          highlightLines: parsedLines,
        }
      } else {
        d.Explanation[id]!.highlightLines = parsedLines
      }
    })

    return () => {
      setAppCtx(d => {
        d.Explanation[id] = undefined
      })
    }
  }, [
    isActive,
    parsedLines,
    setAppCtx,
    id,
  ])

  return (
    <div
      className={clsx('my-2 hover:bg-slate-300 rounded transition-all cursor-pointer border', { 'bg-slate-300': isActive })}
      onMouseOver={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
    >
      {children}
    </div>
  )
}

export default Explanation
