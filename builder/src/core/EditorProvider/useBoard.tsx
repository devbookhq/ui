import { nanoid } from 'nanoid'
import { useDrop } from 'react-dnd'

import { boardBlockType, sidebarIconType } from '..'
import { snapToGrid, xStep, yStep } from './grid'
import { useRootStore } from './models/RootStoreProvider'
import { BoardBlock } from './models/board'

export const canvasClass = 'builder-canvas'

export function getCanvasCoordinates() {
  const canvas = document.getElementsByClassName(canvasClass)[0].getBoundingClientRect()

  return {
    x: canvas.left,
    y: canvas.top,
  }
}

export type DraggedBoardBlock = Pick<BoardBlock, 'id' | 'left' | 'top'>
export type DraggedSidebarBlock = Pick<
  BoardBlock,
  'componentType' | 'props' | 'width' | 'height'
>

export function useBoard() {
  const { board } = useRootStore()

  const [, drop] = useDrop(
    () => ({
      accept: [boardBlockType, sidebarIconType],
      hover(boardOrSidebarBlock: DraggedBoardBlock | DraggedSidebarBlock, monitor) {
        const type = monitor.getItemType()

        if (type === boardBlockType) {
          const boardBlock = boardOrSidebarBlock as DraggedBoardBlock

          const delta = monitor.getDifferenceFromInitialOffset()
          if (!delta) return

          const left = snapToGrid(boardBlock.left + delta.x, xStep)
          const top = snapToGrid(boardBlock.top + delta.y, yStep)

          board?.getBlock(boardBlock.id)?.translate(top, left)
        }
      },
      drop(boardOrSidebarBlock: DraggedBoardBlock | DraggedSidebarBlock, monitor) {
        const type = monitor.getItemType()
        if (type === sidebarIconType) {
          const sidebarBlock = boardOrSidebarBlock as DraggedSidebarBlock

          const offset = monitor.getClientOffset()
          if (!offset) return

          const canvas = getCanvasCoordinates()

          const left = snapToGrid(offset.x - canvas.x, xStep)
          const top = snapToGrid(offset.y - canvas.y, yStep)

          const id = 'block_' + nanoid(14)
          board?.setBlock({
            ...sidebarBlock,
            id,
            left,
            top,
          })
          board?.selectBlock(id)
        }
      },
    }),
    [board],
  )

  return {
    ref: drop,
    boardBlocks: board?.boardBlocks || [],
  }
}
