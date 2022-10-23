import { enableStaticRendering } from 'mobx-react-lite'
import {
  Instance,
  SnapshotOut,
  applySnapshot,
  getSnapshot,
  onSnapshot,
  types,
} from 'mobx-state-tree'
import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react'

import { board } from './board'
import { resources } from './resources'

enableStaticRendering(typeof window === 'undefined')

export const root = types.model({
  board: types.optional(board, {}),
  resources: types.optional(resources, {}),
})

const defaultRootStore = root.create()

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
  const [store] = useState(() => root.create(defaultRootState))

  useEffect(
    function initilizeStore() {
      if (!initialState) return
      applySnapshot(store, initialState)
    },
    [store, initialState],
  )

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
