import { useEffect, useState } from 'react'

function useMousePosition(includeTouch: boolean, disabled?: boolean) {
  const [position, setPosition] = useState<{ x: number; y: number }>()

  useEffect(
    function addListeners() {
      if (disabled) return

      const updateMouse = (e: MouseEvent) => {
        setPosition({ x: e.clientX, y: e.clientY })
      }

      const updateTouch = (e: TouchEvent) => {
        const touch = e.touches.item(0)
        if (touch) {
          setPosition({ x: touch.clientX, y: touch.clientY })
        }
      }

      window.addEventListener('mousemove', updateMouse)
      if (includeTouch) {
        window.addEventListener('touchmove', updateTouch)
      }
      return () => {
        setPosition(undefined)
        window.removeEventListener('mousemove', updateMouse)
        if (includeTouch) {
          window.removeEventListener('touchmove', updateTouch)
        }
      }
    },
    [includeTouch, disabled],
  )

  return position
}

export default useMousePosition
