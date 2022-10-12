import { SnapshotOut, destroy, types } from 'mobx-state-tree'

const boardBlock = types
  .model({
    top: types.number,
    left: types.number,
    id: types.string,
    componentType: types.string,
  })
  .actions(self => ({
    updatePosition(top: number, left: number) {
      self.top = top
      self.left = left
    },
  }))

export type BoardBlock = SnapshotOut<typeof boardBlock>

export const board = types
  .model({
    blocks: types.map(boardBlock),
    selectedBlockID: types.maybeNull(types.string),
  })
  .actions(self => ({
    setBlock(block: BoardBlock) {
      self.blocks.set(block.id, block)
    },
    removeBlock(block: Pick<BoardBlock, 'id'>) {
      const currentBlock = self.blocks.get(block.id)
      if (currentBlock) {
        self.blocks.delete(currentBlock.id)
        destroy(currentBlock)
      }
    },
    moveBlock(block: Pick<BoardBlock, 'id' | 'left' | 'top'>) {
      const currentBlock = self.blocks.get(block.id)
      currentBlock?.updatePosition(block.top, block.left)
    },
  }))
  .views(self => ({
    get selectedBlock() {
      if (self.selectedBlockID) {
        return self.blocks.get(self.selectedBlockID)
      }
    },

    get boardBlocks() {
      return Array.from(self.blocks.values())
    },
  }))

export type Board = SnapshotOut<typeof board>
