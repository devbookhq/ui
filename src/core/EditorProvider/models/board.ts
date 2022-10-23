import { SnapshotOut, destroy, types } from 'mobx-state-tree'

export type BlockProps = { [name: string]: any }

export const boardBlock = types
  .model({
    id: types.identifier,
    top: types.number,
    left: types.number,
    props: types.optional(types.string, '{}'),
    componentType: types.string,
  })
  .views(self => ({
    getProps() {
      const props = JSON.parse(self.props)
      return props as BlockProps
    },
  }))
  .views(self => ({
    getProp(name: string) {
      return self.getProps()[name]
    },
  }))
  .actions(self => ({
    setProp(name: string, value: any) {
      const props = self.getProps()

      self.props = JSON.stringify({
        ...props,
        [name]: value,
      })
    },
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
    selectBlock(id: string) {
      self.selectedBlock = self.blocks.get(id)
    },
    resetBlockSelection() {
      self.selectedBlock = undefined
    },
    setBlock(block: BoardBlock) {
      return self.blocks.put(block)
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
