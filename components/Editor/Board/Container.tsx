import update from 'immutability-helper'
import type { CSSProperties } from 'react'
import { useCallback, useState } from 'react'
import { ConnectDropTarget, useDrop } from 'react-dnd'
import { nanoid } from 'nanoid'

import { boardComponentType, sidebarIconType, BoardItem, renderBoardItem } from '../UIComponent'
import { snapToGrid, xStep, yStep } from './snapToGrid'

const styles: CSSProperties = {
  width: 300,
  height: 300,
  border: '1px solid black',
  position: 'relative',
}

export interface Props {

}

interface ItemMap {
  [id: string]: BoardItem
}

function useBoardItems(initItems: ItemMap = {}): [ItemMap, ConnectDropTarget] {
  const [items, setItems] = useState<ItemMap>(initItems)

  const move = useCallback((id: string, left: number, top: number) => {
    setItems(i =>
      update(i, {
        [id]: {
          $merge: { left, top },
        },
      }),
    )
  }, [])

  const add = useCallback((componentType: string, id: string, left: number, top: number) => {
    setItems(i =>
      update(i, {
        [id]: {
          $set: { left, top, id, componentType },
        },
      }),
    )
  }, [])

  const [, drop] = useDrop(() => ({
    accept: [boardComponentType, sidebarIconType],
    drop(item: BoardItem, monitor) {
      const type = monitor.getItemType()

      if (type === boardComponentType) {
        const delta = monitor.getDifferenceFromInitialOffset()
        if (!delta) return

        const left = snapToGrid(Math.round(item.left + delta.x), xStep)
        const top = snapToGrid(Math.round(item.top + delta.y), yStep)

        move(item.id, left, top)
      } else if (type === sidebarIconType) {
        
        const pos = monitor.getClientOffset()
        if (!pos) return

        const left = snapToGrid(Math.round(pos.x), xStep)
        const top = snapToGrid(Math.round(pos.y), yStep)

        const id = 'ui_' + nanoid()

        add(item.componentType, id, left, top)
      }
    },
  }),
    [
      move,
      add,
    ],
  )

  return [items, drop]
}

function Container({ }: Props) {
  const [items, drop] = useBoardItems({})

  console.log({ items })

  return (
    <div ref={drop} style={styles}>
      {Object.values(items).map((item) => renderBoardItem(item))}
    </div>
  )
}

export default Container
