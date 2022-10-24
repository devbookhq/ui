import produce from 'immer'
import { enableStaticRendering } from 'mobx-react-lite'
import { Instance, SnapshotOut, getSnapshot, onSnapshot, types } from 'mobx-state-tree'
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
    })
  },
})

const defaultRootStore = root.create({})

export const defaultRootState = getSnapshot(defaultRootStore)

type RootInstance = Instance<typeof root>
export type RootState = SnapshotOut<typeof root>

const RootStoreContext = createContext<RootInstance | null>(null)

export interface Props {
  initialState?: RootState
  onStateChange?: (state: RootState) => any
}

function RootStoreProvider({
  children,
  initialState,
  onStateChange,
}: PropsWithChildren<Props>) {
  const [store] = useState(() => root.create(initialState))

  useEffect(
    function handleStoreChange() {
      if (!store) return
      if (!onStateChange) return

      return onSnapshot(store, onStateChange)
    },
    [store, onStateChange],
  )
  return <RootStoreContext.Provider value={store}>{children}</RootStoreContext.Provider>
}

export function useRootStore() {
  const store = useContext(RootStoreContext)
  if (!store) {
    throw new Error('Store cannot be null, please add a context provider')
  }
  return store
}

export default RootStoreProvider
