import { nanoid } from 'nanoid'
import { useDrop } from 'react-dnd'

import useElement from 'utils/useElement'

import { boardComponentType, sidebarIconType } from '../Editor/UIComponent'
import { BoardBlock } from './BoardBlock'
import { snapToGrid, xStep, yStep } from './snapToGrid'
import { ItemMap, useBoardBlocks } from './useBoardBlocks'

export function useBoard(
  serializedApp: object,
): [ItemMap, (i: HTMLDivElement | null) => void] {
  const [items, add, move] = useBoardBlocks(serializedApp as ItemMap)

  const [ref, setRef] = useElement<HTMLDivElement>(e => drop(e))

  const [, drop] = useDrop(
    () => ({
      accept: [boardComponentType, sidebarIconType],
      drop(item: BoardBlock, monitor) {
        const type = monitor.getItemType()

        if (type === boardComponentType) {
          const delta = monitor.getDifferenceFromInitialOffset()
          if (!delta) return

          const left = snapToGrid(Math.round(item.left + delta.x), xStep)
          const top = snapToGrid(Math.round(item.top + delta.y), yStep)

          move({
            id: item.id,
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

          add({
            componentType: item.componentType,
            id,
            left,
            top,
          })
        }
      },
    }),
    [move, add, ref],
  )

  return [items, setRef]
}
