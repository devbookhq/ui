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
      className="flex items-center flex-1"
    >
      <div
        className={clsx('flex transition-all items-center border-r-4', { 'border-slate-200': wasClicked || isActive, 'border-transparent': !wasClicked && !isActive })}
      >
        {children}
      </div>
      <div className="not-prose flex relative">
        <div
          className={clsx('left-2 flex space-x-2 absolute items-center cursor-pointer hover:text-slate-600', { 'text-slate-600': wasClicked, 'text-slate-400': !wasClicked })}
          onMouseOver={() => setIsActive(true)}
          onMouseLeave={() => setIsActive(false)}
          onClick={() => setWasClicked(e => !e)}
        >
          <div
            className={clsx('bg-white border p-1 transition-all rounded border-slate-300 flex hover:bg-slate-50 items-center space-x-1', { 'bg-border border-slate-400': wasClicked })}
          >
            <CurlyBraces size="16px" />
          </div>
          <Text
            size={Text.size.S3}
            text="Show code"
          />
        </div>
      </div>
    </div>
  )
}

export default Explanation
