import { SnapshotOut, types } from 'mobx-state-tree'

const cockroachDB = types
  .model({
    enabled: types.optional(types.maybe(types.boolean), true),
    cached: types.optional(types.maybe(types.boolean), true),
    url: types.optional(types.maybe(types.string), undefined),
    outputFile: types.optional(types.maybe(types.string), undefined),
    outputStringFormat: types.optional(types.maybe(types.string), undefined),
  })
  .actions(self => ({
    setURL(url: string | undefined) {
      self.url = url
    },
    setOutputFile(file: string | undefined) {
      self.outputFile = file
    },
    setOutputStringFormat(format: string | undefined) {
      self.outputStringFormat = format
    },
    setCached(cached: boolean) {
      self.cached = cached
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

export type Resources = SnapshotOut<typeof resources>
