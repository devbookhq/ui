export const xStep = 15
export const yStep = 15

export function snapToGrid(pos: number, step: number) {
  return Math.round(pos / step) * step
}
