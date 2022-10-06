import {
  useEffect,
  useState,
} from 'react'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'

function useDndBackend() {
  const html5 = HTML5Backend
  const touch = TouchBackend

  const [isTouch, setIsTouch] = useState(false)

  useEffect(function detectTouch() {
    if (typeof window === undefined) return
    if ('ontouchstart' in window) {
      setIsTouch(true)
    } else {
      setIsTouch(false)
    }
  }, [])

  return isTouch
    ? touch
    : html5
}

export default useDndBackend
