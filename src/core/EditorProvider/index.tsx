import React, { PropsWithChildren } from 'react'
import { DndProvider } from 'react-dnd'

import ResourceProvider from './ResourceProvider'
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
      <ResourceProvider>
        <DndProvider backend={backend}>{children}</DndProvider>
      </ResourceProvider>
    </RootStoreProvider>
  )
}

export default BuilderProvider
