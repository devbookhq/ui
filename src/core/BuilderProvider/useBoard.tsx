import { nanoid } from 'nanoid'
import { useDrop } from 'react-dnd'

import useElement from 'hooks/useElement'

import { boardBlockType, sidebarIconType } from '..'
import { useRootStore } from './models/RootStoreProvider'
import { BoardBlock } from './models/board'
import { snapToGrid, xStep, yStep } from './snapToGrid'

export function useBoard() {
  const { board } = useRootStore()

  const [ref, setRef] = useElement<HTMLDivElement>(e => drop(e))

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

          board.moveBlock({
            id: block.id,
            left,
            top,
          })
        } else if (type === sidebarIconType) {
          const offset = monitor.getClientOffset()
          if (!offset) return
          if (!ref) return

          const dropTargetPosition = ref.getBoundingClientRect()

          const left = snapToGrid(Math.round(offset.x - dropTargetPosition.left), xStep)
          const top = snapToGrid(Math.round(offset.y - dropTargetPosition.top), yStep)

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
    [ref, board],
  )

  return {
    blocks: board.boardBlocks,
    ref: setRef,
  }
}
