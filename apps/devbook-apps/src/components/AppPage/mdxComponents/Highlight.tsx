import clsx from 'clsx'
import { CurlyBraces, Loader2 } from 'lucide-react'
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import debounce from 'lodash.debounce'

import { parseNumericRange } from 'utils/parseNumericRange'
import Text from 'components/typography/Text'

import { useAppContext } from '../AppContext'
import { useMouseIndicator } from 'hooks/useMouseIndicator'

export interface Props {
  children?: ReactNode
  // Expression like 1-10,20-30
  lines?: string
  // This helps identifying the actual editor
  file?: string
}

let idCounter = 0

const hoverTimeout = 650

function Highlight({ children, lines }: Props) {
  const parsedLines = useMemo(() => lines ? parseNumericRange(lines) : undefined, [lines])
  const [appCtx, setAppCtx] = useAppContext()
  const [isActive, setIsActive] = useState(false)
  const [wasClicked, setWasClicked] = useState(false)

  const [id, setID] = useState<number>()
  useEffect(function getComponentID() {
    setID(idCounter++)
  }, [])

  const indicatorRef = useRef<HTMLDivElement>(null)

  const [isIndicatorVisible, setIndicatorState] = useMouseIndicator(
    indicatorRef,
    !isActive && !wasClicked,
  )

  const debouncedHover = useMemo(() => debounce((active: boolean) => {
    setIsActive(active)
    setIndicatorState(false)
  }, hoverTimeout, {
    leading: false,
    trailing: true,
    maxWait: hoverTimeout,
  }), [setIsActive, setIndicatorState])

  useEffect(function handleEditorHover() {
    if (!parsedLines) return
    if (parsedLines.length === 0) return

    if (!appCtx.Code.hoveredLine || !parsedLines) {
      setIsActive(false)
      debouncedHover(false)
      debouncedHover.flush()
      setIndicatorState(false)
    } else {
      const hasOverlap = parsedLines.includes(appCtx.Code.hoveredLine)
      setIndicatorState(hasOverlap)
      debouncedHover(hasOverlap)
    }
  }, [
    appCtx.Code.hoveredLine,
    parsedLines,
    debouncedHover,
    setIndicatorState,
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
        if (d.Explanation[id]) {
          d.Explanation[id] = undefined
        }
      })
    }
  }, [
    parsedLines,
    setAppCtx,
    id,
  ])

  useEffect(function propagateToAppState() {
    if (id === undefined) return
    if (!parsedLines) return
    if (parsedLines.length === 0) return

    const state = wasClicked || isActive
    if (!state) return

    setAppCtx(d => {
      if (!d.Explanation[id]) {
        d.Explanation[id] = {
          highlightLines: parsedLines,
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
    parsedLines,
    wasClicked,
    setAppCtx,
    id,
  ])

  return (
    <div
      className="
      flex
      items-center
      flex-1
      relative
      my-0.5
      py-1
    "
    >
      {isIndicatorVisible &&
        <div
          ref={indicatorRef}
          className="
          fixed
          z-40
          pointer-events-none
          "
        >
          <div className="absolute -top-2 left-2 text-cyan-200 -rotate-90">
            <Loader2 size="18px" className="absolute" />
            <Loader2 size="18px" className="animate-spin" />
          </div>
        </div>
      }
      <div
        className={clsx(`
          flex
          transition-all
          border-transparent
          border
          z-10
          flex-col
          flex-1
          rounded-md
          items-stretch`,
        )}
      >
        {children}
      </div>
      <div className={clsx(
        `absolute
        transition-all
        inset-y-0
        -inset-x-2
        rounded`,
        {
          'bg-slate-200': wasClicked || isActive,
        },
      )} />
      <div
        className={clsx(`
          right-0
          -mr-5
          top-1/2
          -translate-y-1/2
          translate-x-full
          flex
          space-x-2
          absolute
          not-prose
          group
          items-center
          transition-all
          cursor-pointer
          `,
          {
            'text-slate-600': wasClicked,
            'text-slate-400': !wasClicked,
          })
        }
        onMouseOver={() => setIsActive(true)}
        onMouseLeave={() => setIsActive(false)}
        onClick={() => setWasClicked(e => !e)}
      >
        <div
          className={clsx(`
          bg-white
          p-1
          transition-all
          rounded
          border
          flex
          hover:bg-slate-50
          items-center
          space-x-1
          group-hover:text-cyan-200
          group-hover:border-cyan-200
          `,
            {
              'border-cyan-200 text-cyan-200': wasClicked,
              'border-slate-300': !wasClicked,
            }
          )}
        >
          <CurlyBraces size="16px" />
        </div>
        <Text
          className="group-hover:text-cyan-200 transition-all"
          size={Text.size.S3}
          text="Show code"
        />
      </div>
    </div>
  )
}

export default Highlight
