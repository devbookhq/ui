import { SnapshotOut, types } from 'mobx-state-tree'

const output = types.model({
  type: types.optional(types.enumeration(['file']), 'file'),
  path: types.string,
})

const cockroachDB = types
  .model({
    enabled: types.optional(types.boolean, true),
    cached: types.optional(types.boolean, true),
    url: types.optional(types.maybe(types.string), undefined),
    output: types.optional(types.maybe(output), undefined),
  })
  .actions(self => ({
    setURL(url: string | undefined) {
      self.url = url
    },
  }))

type CockroachDB = SnapshotOut<typeof cockroachDB>

export const resources = types
  .model({
    cockroachDB: types.optional(types.maybe(cockroachDB), undefined),
    environmentID: types.optional(types.maybe(types.string), undefined),
  })
  .actions(self => ({
    setEnvironmentID(envID: string | undefined) {
      self.environmentID = envID
    },
    setCockroachDB(db: CockroachDB | undefined) {
      self.cockroachDB = cockroachDB.create(db)
    },
  }))
