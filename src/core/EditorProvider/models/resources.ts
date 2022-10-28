import { SnapshotOut, types } from 'mobx-state-tree'

const output = types.model({
  type: types.optional(types.enumeration(['file']), 'file'),
  path: types.string,
})

const planetscaleDB = types.model({
  enabled: types.optional(types.boolean, true),
  output,
})

type PlanetscaleDB = SnapshotOut<typeof planetscaleDB>

export const resources = types
  .model({
    planetscaleDB: types.maybe(planetscaleDB),
    environmentID: types.optional(types.maybe(types.string), undefined),
  })
  .actions(self => ({
    setEnvironmentID(envID: string | undefined) {
      self.environmentID = envID
    },
    setPlanetscaleDB(planetScaleDB: PlanetscaleDB | undefined) {
      self.planetscaleDB = planetScaleDB
    },
  }))
