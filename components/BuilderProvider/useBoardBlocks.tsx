import update from 'immutability-helper'
import { useCallback, useState } from 'react'

import { BoardBlock } from './BoardBlock'

export interface ItemMap {
  [id: string]: BoardBlock
}

export interface MoveItem {
  (item: Pick<BoardBlock, 'id' | 'left' | 'top'>): void
}

export interface AddItem {
  (item: BoardBlock): void
}

export function useBoardBlocks(initItems: ItemMap = {}): [ItemMap, AddItem, MoveItem] {
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
