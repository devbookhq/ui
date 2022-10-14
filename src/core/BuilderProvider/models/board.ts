import { SnapshotOut, destroy, types } from 'mobx-state-tree'

const boardBlock = types
  .model({
    id: types.identifier,
    top: types.number,
    left: types.number,
    componentType: types.string,
  })
  .actions(self => ({
    translate(top: number, left: number) {
      self.top = top
      self.left = left
    },
  }))

export type BoardBlock = SnapshotOut<typeof boardBlock>

export const board = types
  .model({
    blocks: types.map(boardBlock),
    selectedBlock: types.safeReference(boardBlock),
  })
  .views(self => ({
    getBlock(id: string) {
      return self.blocks.get(id)
    },
  }))
  .views(self => ({
    get boardBlocks() {
      return Array.from(self.blocks.values())
    },
  }))
  .actions(self => ({
    selectBlock(id: string): boolean {
      const block = self.blocks.get(id)
      if (block) {
        self.selectedBlock = block
        return true
      }
      return false
    },
    resetBlockSelection() {
      self.selectedBlock = undefined
    },
    setBlock(block: BoardBlock) {
      self.blocks.put(block)
    },
    removeBlock(block: Pick<BoardBlock, 'id'>) {
      const currentBlock = self.blocks.get(block.id)
      if (currentBlock) {
        self.blocks.delete(currentBlock.id)
        destroy(currentBlock)
      }
    },
  }))

export type Board = SnapshotOut<typeof board>
