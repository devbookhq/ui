import { nanoid } from 'nanoid'
import { useDrop } from 'react-dnd'

import { boardBlockType, sidebarIconType } from '..'
import { snapToGrid, xStep, yStep } from './grid'
import { useRootStore } from './models/RootStoreProvider'
import { BoardBlock } from './models/board'

export const canvasClass = 'builder-canvas'

export function getCanvas() {
  return document.getElementsByClassName(canvasClass)[0].getBoundingClientRect()
}

export function useBoard() {
  const { board } = useRootStore()

  const [, drop] = useDrop(
    () => ({
      accept: [boardBlockType, sidebarIconType],
      drop(block: BoardBlock, monitor) {
        const type = monitor.getItemType()

        if (type === boardBlockType) {
          const delta = monitor.getDifferenceFromInitialOffset()
          if (!delta) return

          const left = snapToGrid(Math.round(block.left + delta.x), xStep)
          const top = snapToGrid(Math.round(block.top + delta.y), yStep)

          board.getBlock(block.id)?.translate(top, left)
        } else if (type === sidebarIconType) {
          const offset = monitor.getClientOffset()
          if (!offset) return

          const canvas = getCanvas()

          const left = snapToGrid(Math.round(offset.x - canvas.left), xStep)
          const top = snapToGrid(Math.round(offset.y - canvas.top), yStep)

          const id = 'ui_' + nanoid()

          board.setBlock({
            componentType: block.componentType,
            id,
            left,
            top,
          })
        }
      },
    }),
    [board],
  )

  return {
    blocks: board.boardBlocks,
    ref: drop,
  }
}
