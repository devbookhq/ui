import React, { PropsWithChildren } from 'react'
import { DndProvider } from 'react-dnd'

import EnvironmentProvider from '../../components/EnvironmentProvider'
import RootStoreProvider, {
  Props as RootStoreProviderProps,
} from './models/RootStoreProvider'
import useDndBackend from './useDndBackend'

export interface Props extends RootStoreProviderProps {}

function BuilderProvider({ children, ...rest }: PropsWithChildren<Props>) {
  const backend = useDndBackend()
  return (
    <RootStoreProvider {...rest}>
      <EnvironmentProvider>
        <DndProvider backend={backend}>{children}</DndProvider>
      </EnvironmentProvider>
    </RootStoreProvider>
  )
}

export default BuilderProvider
