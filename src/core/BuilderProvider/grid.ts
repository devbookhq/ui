import { CSSProperties } from 'react'

export const xStep = 15
export const yStep = 15

export function snapToGrid(pos: number, step: number) {
  return Math.round(pos / step) * step
}

export function getGridStyle(xStep: number, yStep: number): CSSProperties {
  return {
    backgroundImage: `radial-gradient(
    circle at 0.5px 0.5px,
    rgb(49, 49, 49) 0.5px,
    transparent 0
  )`,
    backgroundSize: `${xStep}px ${yStep}px`,
  }
}
