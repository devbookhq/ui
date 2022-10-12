import React, { PropsWithChildren } from 'react'
import { DndProvider } from 'react-dnd'

import RootStoreProvider, {
  Props as RootStoreProviderProps,
} from './models/RootStoreProvider'
import useDndBackend from './useDndBackend'

export interface Props extends RootStoreProviderProps {}

function BuilderProvider({
  children,
  onStateChange,
  initialState,
}: PropsWithChildren<Props>) {
  const backend = useDndBackend()
  return (
    <RootStoreProvider
      initialState={initialState}
      onStateChange={onStateChange}
    >
      <DndProvider backend={backend}>{children}</DndProvider>
    </RootStoreProvider>
  )
}

export default BuilderProvider
