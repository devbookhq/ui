import clsx from 'clsx'
import { CurlyBraces } from 'lucide-react'
import { ReactNode, useEffect, useMemo, useState } from 'react'

import { parseNumericRange } from 'utils/parseNumericRange'
import Text from 'components/typography/Text'
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
  const [wasClicked, setWasClicked] = useState(false)

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

    setAppCtx(d => {
      if (!d.Explanation[id]) {
        d.Explanation[id] = {
          highlightLines: parsedLines,
          enabled: false
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
    parsedLines,
    setAppCtx,
    id,
  ])

  useEffect(function propagateToAppState() {
    if (id === undefined) return
    const state = wasClicked || isActive
    console.log(state)
    if (!state) return


    setAppCtx(d => {
      if (!d.Explanation[id]) {
        d.Explanation[id] = {
          highlightLines: [],
          enabled: true
        }
      } else {
        d.Explanation[id]!.enabled = state
      }
    })

    return () => {
      setAppCtx(d => {
        if (d.Explanation[id]) {
          d.Explanation[id]!.enabled = false
        }
      })
    }
  }, [
    isActive,
    wasClicked,
    setAppCtx,
    id,
  ])

  return (
    <div
      className="flex items-center space-x-4"
    >
      <div
        className={clsx('rounded px-2 flex transition-all items-center', { 'bg-slate-200': wasClicked || isActive })}
      >
        {children}
      </div>
      <div
        className={clsx('cursor-pointer border p-2 transition-all rounded border-slate-300 flex hover:bg-slate-200 items-center space-x-1', { 'bg-slate-200': wasClicked || isActive })}
        onMouseOver={() => setIsActive(true)}
        onMouseLeave={() => setIsActive(false)}
        onClick={() => setWasClicked(e => !e)}
      >
        <CurlyBraces size="16px" />
        <Text
          size={Text.size.S3}
          text="Code"
        />
      </div>
    </div >
  )
}

export default Explanation
