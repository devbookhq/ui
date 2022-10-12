import update from 'immutability-helper'
import {
  DefaultValue,
  atom,
  atomFamily,
  selector,
  selectorFamily,
  useRecoilCallback,
  useRecoilValue,
} from 'recoil'

import { notEmpty } from 'utils/notEmpty'

export interface BoardBlock {
  top: number
  id: string
  left: number
  props?: object
  componentType: string
}

const blocksFamily = atomFamily<BoardBlock | undefined, string>({
  key: 'blocks',
  effects: [
    ({ onSet }) => {
      onSet(newBlock => {
        console.log('New block', newBlock)
      })
    },
  ],
})

const blockIDsAtom = atom<string[]>({
  key: 'blockIDs',
  default: [],
})

export const getAllBlocksSelector = selector<BoardBlock[]>({
  key: 'getAllBlocks',
  get: ({ get }) =>
    get(blockIDsAtom)
      .map(id => get(blocksFamily(id)))
      .filter(notEmpty),
})

export const updateBlockSelector = selectorFamily<
  Partial<BoardBlock> | undefined,
  string
>({
  key: 'updateBlocks',
  get:
    id =>
    ({ get }) =>
      get(blocksFamily(id)),
  set:
    id =>
    ({ set }, newBlock) => {
      if (newBlock instanceof DefaultValue) {
        set(blocksFamily(id), newBlock)
      } else if (newBlock) {
        set(blocksFamily(id), s => (s ? update(s, { $merge: newBlock }) : s))
      }
    },
})

export const setBlockSelector = selectorFamily<BoardBlock | undefined, string>({
  key: 'setBlock',
  get:
    id =>
    ({ get }) =>
      get(blocksFamily(id)),
  set:
    id =>
    ({ set, reset }, newBlock) => {
      if (newBlock instanceof DefaultValue || !newBlock) {
        reset(blocksFamily(id))
        set(blockIDsAtom, prevValue => prevValue.filter(id => id !== id))
      } else if (newBlock) {
        set(blocksFamily(id), newBlock)
        set(blockIDsAtom, ids => [...ids, id])
      }
    },
})

export function useBoardBlocks() {
  return useRecoilValue(getAllBlocksSelector)
}

export function useBoardBlockControls() {
  const set = useRecoilCallback(
    ({ set }) =>
      (item: BoardBlock) =>
        set(setBlockSelector(item.id), item),
    [],
  )

  const update = useRecoilCallback(
    ({ set }) =>
      (item: Pick<BoardBlock, 'id'> & Partial<BoardBlock>) =>
        set(updateBlockSelector(item.id), item),
    [],
  )

  const remove = useRecoilCallback(
    ({ set }) =>
      (item: Pick<BoardBlock, 'id'>) =>
        set(setBlockSelector(item.id), undefined),
    [],
  )

  return {
    set,
    update,
    remove,
  }
}
