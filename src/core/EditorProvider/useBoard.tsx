import { nanoid } from 'nanoid'
import { useDrop } from 'react-dnd'

import { UIComponentSetup, boardBlockType, sidebarIconType } from '..'
import { snapToGrid, xStep, yStep } from './grid'
import { useRootStore } from './models/RootStoreProvider'
import { BoardBlock } from './models/board'

export const canvasClass = 'builder-canvas'

export function getCanvas() {
  return document.getElementsByClassName(canvasClass)[0].getBoundingClientRect()
}

export function useBoard(setup: UIComponentSetup) {
  const { board } = useRootStore()

  const [, drop] = useDrop(
    () => ({
      accept: [boardBlockType, sidebarIconType],
      drop(block: BoardBlock, monitor) {
        const type = monitor.getItemType()

        if (type === boardBlockType) {
          const delta = monitor.getDifferenceFromInitialOffset()
          if (!delta) return

          const left = snapToGrid(block.left + delta.x, xStep)
          const top = snapToGrid(block.top + delta.y, yStep)

          board.getBlock(block.id)?.translate(top, left)
        } else if (type === sidebarIconType) {
          const offset = monitor.getClientOffset()
          if (!offset) return

          const canvas = getCanvas()

          const left = snapToGrid(offset.x - canvas.left, xStep)
          const top = snapToGrid(offset.y - canvas.top, yStep)

          const uiComponentSetup = setup[block.componentType]
          if (!uiComponentSetup) return

          const id = 'block_' + nanoid(14)
          board.setBlock({
            componentType: block.componentType,
            id,
            left,
            top,
            props: block.props,
            ...uiComponentSetup.defaultSize,
          })
          board.selectBlock(id)
        }
      },
    }),
    [board],
  )

  return {
    ref: drop,
  }
}
