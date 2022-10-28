import produce from 'immer'
import { enableStaticRendering } from 'mobx-react-lite'
import { Instance, SnapshotOut, applySnapshot, onSnapshot, types } from 'mobx-state-tree'
import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react'

import { board } from './board'
import { resources } from './resources'

enableStaticRendering(typeof window === 'undefined')

const rootWithoutProcessing = types.model({
  board: types.optional(board, {}),
  resources: types.optional(resources, {}),
})

// Because we don't want to serialize and save some parts of the state we filter them in the snapshot post processing function.
export const root = types.snapshotProcessor(rootWithoutProcessing, {
  postProcessor(snapshot) {
    return produce(snapshot, draft => {
      draft.board.selectedBlock = undefined
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
  const [instance, setInstance] = useState<RootInstance>(() => root.create({}))

  useEffect(
    function handleOnInit() {
      if (!instance) return
      onInit?.(instance)
    },
    [instance, onInit],
  )

  useEffect(
    function initializeStore() {
      const newInstance = root.create({})

      if (initialState) {
        applySnapshot(newInstance, initialState)
      }

      setInstance(newInstance)
    },
    [initialState],
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
