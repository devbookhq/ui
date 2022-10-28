import { SnapshotOut, destroy, types } from 'mobx-state-tree'

import { xStep, yStep } from '../grid'

export type BlockProps = { [name: string]: any }

export const boardBlock = types
  .model({
    id: types.identifier,
    top: types.number,
    width: types.optional(types.number, xStep),
    height: types.optional(types.number, yStep),
    left: types.number,
    props: types.optional(types.string, '{}'),
    componentType: types.string,
  })
  .views(self => ({
    getProps(): BlockProps {
      const props = JSON.parse(self.props)
      return props
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
    reposition({
      width,
      height,
      top,
      left,
    }: {
      width: number
      height: number
      left: number
      top: number
    }) {
      self.width = width
      self.height = height
      self.top = top
      self.left = left
    },
    resize(width: number, height: number) {
      self.width = width
      self.height = height
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
