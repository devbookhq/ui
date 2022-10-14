import { SnapshotOut, destroy, types } from 'mobx-state-tree'

const blockProp = types.model({})

const boardBlock = types
  .model({
    id: types.identifier,
    top: types.number,
    left: types.number,
    width: types.number,
    height: types.number,
    props: types.map(blockProp),
    componentType: types.string,
  })
  .actions(self => ({
    translate(top: number, left: number) {
      self.top = top
      self.left = left
    },
    resize(width: number, height: number) {
      self.width = width
      self.height = height
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
    selectBlock(id: string) {
      self.selectedBlock = self.blocks.get(id)
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
