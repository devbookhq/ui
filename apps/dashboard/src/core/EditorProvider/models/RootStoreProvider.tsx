import produce from 'immer'
import { enableStaticRendering } from 'mobx-react-lite'
import { Instance, SnapshotOut, applySnapshot, onSnapshot, types } from 'mobx-state-tree'
import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react'

import { board } from './board'
import { resources } from './resources'

enableStaticRendering(typeof window === 'undefined')

const rootWithoutProcessing = types
  .model({
    pages: types.optional(types.array(board), [{}]),
    selectedPage: types.optional(types.number, 0),
    resources: types.optional(resources, {}),
  })
  .views(self => ({
    get board() {
      if (self.pages.length > self.selectedPage) {
        return self.pages[self.selectedPage]
      }
      return undefined
    },
  }))
  .actions(self => ({
    createPage() {
      self.pages.push(board.create({}))
    },
    deletePage(idx: number) {
      self.pages.splice(idx, 1)
    },
    selectPage(idx: number) {
      if (self.pages.length > idx) {
        self.selectedPage = idx
      }
    },
  }))

// Because we don't want to serialize and save some parts of the state we filter them in the snapshot post processing function.
export const root = types.snapshotProcessor(rootWithoutProcessing, {
  postProcessor(snapshot) {
    return produce(snapshot, draft => {
      Object.values(draft.pages).forEach(v => {
        v.selectedBlock = undefined
      })

      draft.selectedPage = 0

      if (draft.resources.cockroachDB) {
        draft.resources.cockroachDB.url = undefined
      }
    })
  },
})

export type RootInstance = Instance<typeof root>
export type RootState = SnapshotOut<typeof root>

const RootStoreContext = createContext<RootInstance>(root.create({}))

export interface Props {
  initialState?: RootState
  onInit?: (instance?: RootInstance) => any
  onStateChange?: (state: RootState) => any
}

function RootStoreProvider({
  children,
  initialState,
  onInit,
  onStateChange,
}: PropsWithChildren<Props>) {
  const [instance] = useState<RootInstance>(() => root.create({}))

  useEffect(
    function handleOnInit() {
      if (!instance) return
      onInit?.(instance)
    },
    [instance, onInit],
  )

  useEffect(
    function initializeStore() {
      if (initialState) {
        applySnapshot(instance, initialState)
      }
    },
    [instance, initialState],
  )

  useEffect(
    function handleStoreChange() {
      if (!instance) return
      if (!onStateChange) return

      return onSnapshot(instance, onStateChange)
    },
    [instance, onStateChange],
  )
  return (
    <RootStoreContext.Provider value={instance}>{children}</RootStoreContext.Provider>
  )
}

export function useRootStore() {
  const store = useContext(RootStoreContext)
  if (!store) {
    throw new Error('Store cannot be null, please add a context provider')
  }
  return store
}

export default RootStoreProvider
