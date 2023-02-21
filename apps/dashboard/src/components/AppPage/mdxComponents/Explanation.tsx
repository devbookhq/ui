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
      className="
      flex
      items-center
      flex-1
      relative
      py-0.5
    "
    >
      <div
        className={clsx(`
          flex
          transition-all
          items-center`,
        )}
      >
        {children}
      </div>
      <div
        className={clsx(`
          flex
          transition-all
          self-stretch
          rounded
          border-4`,
          {
            'border-violet-300': wasClicked || isActive,
            'border-transparent': !wasClicked && !isActive,
          })}
      />
      <div
        className={clsx(`
          right-0
          -mr-4
          top-1/2
          -translate-y-1/2
          translate-x-full
          flex
          space-x-2
          absolute
          not-prose
          items-center
          cursor-pointer
          hover:text-slate-600
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
          `,
            {
              'border-cyan-500 text-cyan-500': wasClicked,
              'border-slate-300': !wasClicked,
            }
          )}
        >
          <CurlyBraces size="16px" />
        </div>
        <Text
          size={Text.size.S3}
          text="Show code"
        />
      </div>
    </div>
  )
}

export default Explanation
