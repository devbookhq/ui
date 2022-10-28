import { CSSProperties } from 'react'
import { XYCoord } from 'react-dnd'

export const xStep = 15
export const yStep = 15

export function snapToGrid(pos: number, step: number) {
  return Math.round(pos / step) * step
}

export function getGridStyle(xStep: number, yStep: number, color: string): CSSProperties {
  return {
    backgroundImage: `radial-gradient(
    circle at 0.5px 0.5px,
    ${color} 0.5px,
    transparent 0
  )`,
    backgroundSize: `${xStep}px ${yStep}px`,
  }
}

export function getBlockOffset(
  initialOffset: XYCoord | null,
  currentOffset: XYCoord | null,
): XYCoord | null {
  if (!initialOffset || !currentOffset) {
    return null
  }

  let { x, y } = currentOffset

  x -= initialOffset.x
  y -= initialOffset.y

  x = snapToGrid(x, xStep)
  y = snapToGrid(y, yStep)

  x += initialOffset.x
  y += initialOffset.y

  x = Math.round(x)
  y = Math.round(y)

  return { x, y }
}
