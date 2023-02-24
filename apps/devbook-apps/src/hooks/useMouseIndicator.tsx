import { Dispatch, SetStateAction, useEffect, useState, RefObject } from 'react'

export function useMouseIndicator(ref: RefObject<HTMLElement>, enabled?: boolean): [boolean, Dispatch<SetStateAction<boolean>>] {
  const [isActive, setIsActive] = useState(false)

  useEffect(function attach() {
    if (!ref.current) return
    if (!enabled) return
    if (!isActive) return

    const handleWindowMouseMove = (event: MouseEvent) => {
      if (!ref.current) return
      const x = event.clientX
      const y = event.clientY

      ref.current.style.top = `${y}px`
      ref.current.style.left = `${x}px`
    }

    window.addEventListener('mousemove', handleWindowMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove)
    }
  }, [
    enabled,
    isActive,
    ref,
  ])

  return [!!(isActive && enabled), setIsActive]
}
