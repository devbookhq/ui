import update from 'immutability-helper'
import { nanoid } from 'nanoid'
import { useCallback, useState } from 'react'
import { useDrop } from 'react-dnd'

import useElement from 'utils/useElement'

import {
  BoardItem,
  boardComponentType,
  renderBoardItem,
  sidebarIconType,
} from '../UIComponent'
import { snapToGrid, xStep, yStep } from './snapToGrid'

interface ItemMap {
  [id: string]: BoardItem
}

interface MoveItem {
  (item: Pick<BoardItem, 'id' | 'left' | 'top'>): void
}

interface AddItem {
  (item: BoardItem): void
}

export function useBoardItems(initItems: ItemMap = {}): [ItemMap, AddItem, MoveItem] {
  const [items, setItems] = useState<ItemMap>(initItems)

  const move = useCallback<MoveItem>(({ id, left, top }) => {
    setItems(i =>
      update(i, {
        [id]: {
          $merge: {
            left,
            top,
          },
        },
      }),
    )
  }, [])

  const add = useCallback<AddItem>(({ componentType, id, left, top }) => {
    setItems(i =>
      update(i, {
        [id]: {
          $set: {
            left,
            top,
            id,
            componentType,
          },
        },
      }),
    )
  }, [])

  return [items, add, move]
}

function useBoardDrag(): [ItemMap, (i: HTMLDivElement | null) => void] {
  const [items, add, move] = useBoardItems()

  const [ref, setRef] = useElement<HTMLDivElement>(e => drop(e))

  const [, drop] = useDrop(
    () => ({
      accept: [boardComponentType, sidebarIconType],
      drop(item: BoardItem, monitor) {
        const type = monitor.getItemType()
        console.log({
          type,
          item,
        })

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
          console.log({})

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

export interface Props {}

function Container({}: Props) {
  const [items, ref] = useBoardDrag()

  console.log(items)
  return (
    <div
      ref={ref}
      className="relative flex flex-1"
    >
      {Object.values(items).map(item => renderBoardItem(item))}
    </div>
  )
}

export default Container
