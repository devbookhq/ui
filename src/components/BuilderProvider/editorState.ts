import update from 'immutability-helper'
import { DefaultValue, atom, selector, useRecoilState } from 'recoil'

import { BoardBlock, setBlockSelector } from './boardBlock'

interface Canvas {
  top: number
  left: number
  width: number
  height: number
}

export interface EditorState {
  canvas: Canvas
  selectedBlockID?: string
}

const editorStateAtom = atom<EditorState>({
  key: 'editorState',
  default: {
    canvas: {
      top: 0,
      left: 0,
      width: 0,
      height: 0,
    },
  },
})

export const getEditorCanvasSelector = selector<EditorState['canvas']>({
  key: 'getEditorCanvas',
  get: ({ get }) => get(editorStateAtom).canvas,
  set: ({ set }, newCanvas) => {
    if (newCanvas instanceof DefaultValue || !newCanvas) {
      set(editorStateAtom, s => update(s, { $unset: ['canvas'] }))
    } else {
      set(editorStateAtom, s => update(s, { $merge: { canvas: newCanvas } }))
    }
  },
})

export const getSelectedBlockSelector = selector<BoardBlock | undefined>({
  key: 'getSelectedBlock',
  get: ({ get }) => {
    const state = get(editorStateAtom)
    if (!state.selectedBlockID) return
    return get(setBlockSelector(state.selectedBlockID))
  },
  set: ({ set }, selectedBlock) => {
    if (selectedBlock instanceof DefaultValue || !selectedBlock) {
      set(editorStateAtom, s => update(s, { $unset: ['selectedBlockID'] }))
    } else {
      set(editorStateAtom, s =>
        update(s, { $merge: { selectedBlockID: selectedBlock.id } }),
      )
    }
  },
})

export function useSelectedBlock() {
  return useRecoilState(getSelectedBlockSelector)
}

export function useEditorCanvas() {
  return useRecoilState(getEditorCanvasSelector)
}
