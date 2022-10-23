import { SnapshotOut, types } from 'mobx-state-tree'

export const resources = types
  .model({
    environmentID: types.optional(types.maybe(types.string), undefined),
  })
  .actions(self => ({
    setEnvironmentID(envID: string | undefined) {
      self.environmentID = envID
    },
  }))

export type Board = SnapshotOut<typeof resources>
