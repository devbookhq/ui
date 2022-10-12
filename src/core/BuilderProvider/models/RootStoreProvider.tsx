import { Instance, SnapshotOut, onSnapshot, types } from 'mobx-state-tree'
import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react'

import { board } from './board'

const root = types.model({
  board,
})

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
