export const xStep = 10
export const yStep = 10

export function snapToGrid(pos: number, step: number) {
  return Math.round(pos / step) * step
}
