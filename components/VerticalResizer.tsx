import cn from 'classnames'
import {
  useRef,
  ReactNode,
  MouseEvent as ReactMouseEvent,
  useState,
} from 'react'

import useEventListener from 'utils/useEventListener'
import useElement from 'utils/useElement'

export interface Props {
  className?: string,
  children: ReactNode
  initHeight?: number // in px
  onResizeStarted?: () => void
  onResizeFinished?: () => void
}

function VerticalResizer({
  className,
  children,
  onResizeStarted,
  onResizeFinished,
  initHeight,
}: Props) {
  const gutterRef = useRef<HTMLDivElement>(null)
  const [childrenEl, setChildrenEl] = useElement<HTMLDivElement>((el) => {
    if (initHeight) {
      el.style.height = `${initHeight}px`
    }
  })

  const [draggingEvent, setDraggingEvent] = useState<{ bottom: number, height: number }>()

  function startDragging(e: ReactMouseEvent<HTMLDivElement>) {
    e.preventDefault()

    if (!gutterRef.current) return
    if (!childrenEl) return

    onResizeStarted?.()
    const { height } = childrenEl.getBoundingClientRect()

    setDraggingEvent({ height, bottom: e.clientY })

    childrenEl.style.userSelect = 'none'
    gutterRef.current.style.cursor = 'row-resize'
    document.body.style.cursor = 'row-resize'
  }

  function stopDragging() {
    if (!draggingEvent) return
    if (!gutterRef.current) return
    if (!childrenEl) return

    setDraggingEvent(undefined)

    childrenEl.style.userSelect = ''

    gutterRef.current.style.cursor = ''
    document.body.style.cursor = ''

    onResizeFinished?.()
  }

  function drag(e: MouseEvent) {
    if (!draggingEvent) return
    if (!childrenEl) return

    const { bottom, height } = draggingEvent

    const offset = e.clientY - bottom
    //const newHeight = Math.max(minHeight, height + offset)
    const newHeight = height + offset

    childrenEl.style.height = `${newHeight}px`
  }

  useEventListener('mouseup', stopDragging, [stopDragging])
  useEventListener('mousemove', drag, [drag])

  return (
    <>
      <div
        ref={setChildrenEl}
        className={cn(
          'flex',
          className,
        )}
      >
        {children}
      </div>
      <div
        className="
          p-0.5
          flex
          items-center
          justify-center
          cursor-row-resize
          bg-black-800
          hover:bg-black-900
        "
        ref={gutterRef}
        onMouseDown={startDragging}
      >
        <div
          className="
            h-1
            w-6
            rounded
            bg-black-700
          "
        />
      </div>
    </>
  )
}

export default VerticalResizer
