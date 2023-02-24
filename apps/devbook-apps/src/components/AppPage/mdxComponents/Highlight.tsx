import clsx from 'clsx'
import { CurlyBraces } from 'lucide-react'
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { parseNumericRange } from 'utils/parseNumericRange'
import Text from 'components/typography/Text'

import { useAppContext } from '../AppContext'
import { useMouseIndicator } from 'hooks/useMouseIndicator'
import { transition } from './Code'

export interface Props {
  children?: ReactNode
  // Expression like 1-10,20-30
  lines?: string
  // This helps identifying the actual editor
  file?: string
}

let idCounter = 0

const tailwindTransition = {
  transitionProperty: 'all',
  transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
  transitionDuration: '150ms',
}

enum Hover {
  None,
  Gutter,
  Button,
}

function Highlight({ children, lines }: Props) {
  const parsedLines = useMemo(() => lines ? parseNumericRange(lines) : undefined, [lines])
  const [appCtx, setAppCtx] = useAppContext()
  const [hover, setHovered] = useState(Hover.None)
  const [isSelected, setIsSelected] = useState(false)

  const [id, setID] = useState<number>()
  useEffect(function getComponentID() {
    setID(idCounter++)
  }, [])

  const indicatorRef = useRef<HTMLDivElement>(null)

  const [isIndicatorVisible, setIndicatorState] = useMouseIndicator(
    indicatorRef,
    !isSelected,
  )

  useEffect(function handleEditorHover() {
    if (!parsedLines) return
    if (parsedLines.length === 0) return

    if (!appCtx.Code.hoveredLine || !parsedLines) {
      setHovered(Hover.None)
      setIndicatorState(false)
    } else {
      const hasOverlap = parsedLines.includes(appCtx.Code.hoveredLine)
      setIndicatorState(hasOverlap)
      setHovered(hasOverlap ? Hover.Gutter : Hover.None)
    }
  }, [
    appCtx.Code.hoveredLine,
    parsedLines,
    setIndicatorState,
  ])

  const handleLineClick = useCallback((line: number) => {
    if (!parsedLines) return
    const hasOverlap = parsedLines.includes(line)
    if (hasOverlap) {
      setIsSelected(s => !s)
    }
  }, [parsedLines])

  useEffect(function attachToAppState() {
    if (id === undefined) return
    if (!parsedLines) return
    if (parsedLines.length === 0) return

    setAppCtx(d => {
      if (!d.Explanation[id]) {
        d.Explanation[id] = {
          highlightLines: parsedLines,
          lineClickHandler: handleLineClick,
        }
      } else {
        d.Explanation[id]!.highlightLines = parsedLines
        d.Explanation[id]!.lineClickHandler = handleLineClick
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
    handleLineClick,
    id,
  ])

  useEffect(function propagateToAppState() {
    if (id === undefined) return
    if (!parsedLines) return
    if (parsedLines.length === 0) return

    const state = isSelected || hover !== Hover.None
    if (!state) return

    setAppCtx(d => {
      if (!d.Explanation[id]) {
        d.Explanation[id] = {
          highlightLines: parsedLines,
          lineClickHandler: handleLineClick,
          enabled: true,
          scroll: isSelected || hover === Hover.Button,
        }
      } else {
        d.Explanation[id]!.enabled = state
        d.Explanation[id]!.scroll = isSelected || hover === Hover.Button
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
    hover,
    parsedLines,
    isSelected,
    handleLineClick,
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
      {/* {isIndicatorVisible &&
        <div
          ref={indicatorRef}
          className="
          z-40
          fixed
          pointer-events-none
          "
        >
          <div className="absolute top-1 left-2">
            <svg className="indicator">
              <circle className="indicator-bg" cx="12" cy="12" r="8" />
              <circle className="meter" cx="12" cy="12" r="8" />
            </svg>
          </div>
        </div>
      } */}
      <div
        className={clsx(`
          flex
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
      <div
        style={isSelected ? tailwindTransition : transition}
        className={clsx(
          `absolute
        inset-y-0
        -inset-x-2
        rounded-lg`,
          {
            'bg-slate-400/20': isSelected || hover,
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
          transition-all
          absolute
          not-prose
          items-center
          hover:text-slate-600
          cursor-pointer
          `,
          {
            'text-slate-600': isSelected,
            'text-slate-400': !isSelected,
          })
        }
        onMouseOver={() => setHovered(Hover.Button)}
        onMouseLeave={() => setHovered(Hover.None)}
        onClick={() => setIsSelected(e => !e)}
      >
        <div
          style={isSelected ? tailwindTransition : transition}
          className={clsx(`
          bg-white
          p-1
          rounded
          border
          flex
          transition-all
          items-center
          space-x-1
          `,
            {
              'border-cyan-500': isSelected,
              'border-slate-300': !isSelected,
            }
          )}
        >
          <CurlyBraces size="16px" />
        </div>
        <Text
          className="transition-all font-mono"
          size={Text.size.S3}
          text={isSelected ? 'Hide code' : 'Show code'}
        />
      </div>
    </div>
  )
}

export default Highlight
